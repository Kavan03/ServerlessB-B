import logging
import boto3
import uuid
import json
import datetime
import time
import os
import dateutil.parser
from boto3.dynamodb.conditions import Key, Attr

# code references: https://aws-ml-blog.s3.amazonaws.com/artifacts/lex-fallback-intent/lambda_function.py, https://stackoverflow.com/questions/64221100/limit-and-sort-dynamodb-results-with-filterexpression-python, https://www.youtube.com/watch?v=eqj-dHXYH2A, https://www.youtube.com/watch?v=LZYDn5smlYg, https://www.youtube.com/watch?v=6ELHyv4-ioo

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

dyn_client = boto3.client('dynamodb')
TABLE_NAME = 'Room'


def safe_int(n):
    
    if n is not None:
        return int(n)
        
    return n  
    
def try_ex(func):
    
    try:
        return func()
    except KeyError:
        return None

def elicit_slot(session_attributes ,intent_name ,slots ,slot_to_elicit ,message):
    return {
        'sessionAttributes': session_attributes,
        'dialogAction': {
            'type': 'ElicitSlot',
            'intentName': intent_name,
            'slots': slots,
            'slotToElicit': slot_to_elicit,
            'message': {'contentType': 'PlainText', 'content': message }
        }
    }

def confirm_intent( session_attributes , intent_name , slots , message) :
    return {
        'sessionAttributes' : session_attributes ,
        'dialogAction' : {
            'type' :  'ConfirmIntent' ,
            'intentName' : intent_name ,
            'slots' : slots ,
            'message' : message  
        }
    } 

def close(session_attributes ,fulfillment_state ,message) :
    response = {
        'sessionAttributes' : session_attributes ,
        'dialogAction' : {
            'type' :  'Close' ,
            'fulfillmentState' : fulfillment_state ,
            'message' : message  
        }
    }
    
    return response

def delegate(session_attributes ,slots) :
    return {
        'sessionAttributes' : session_attributes ,
        'dialogAction' : {
            'type' :  'Delegate',
            'slots' : slots 
        }
    }

def delete_room(roomId) :
    key={'id': { 'S':roomId } } 
 
    data=dyn_client.update_item(
        TableName=TABLE_NAME,
        Key=key,
        ExpressionAttributeNames={
            '#t': 'available',
            '#u': 'userId'
        },
        UpdateExpression='SET #t = :val, #u = :val2',
        ExpressionAttributeValues={
            ':val':{
                'S':'Yes'
            },
            ':val2':{
                'S': ''
            }
        }
    )    
    
def update_room(type,userId):
    id = str (uuid.uuid4())

    items = avlb_rooms(type)
    print(items[0])
    
    roomNumber=items[0]['number']
    roomId=items[0]['id']
    
    key={"id":{"S":roomId}}
    data=dyn_client.update_item(
        TableName=TABLE_NAME,
        Key=key,
        ExpressionAttributeNames={
            '#t': 'available',
            '#u': 'userId'
        },
        UpdateExpression='SET #t = :val, #u = :val2',
        ExpressionAttributeValues={
            ':val':{
                'S':'No'
            },
            ':val2':{
                'S': userId
            }
        }
    )
    
    print('data here:    ')
    print(data)
    ordered_room={'id':roomId,'number':roomNumber,'type':type,'userId':userId}
    print(ordered_room)
    saveInvoiceToS3(userId,str(ordered_room))
    
    return roomNumber

def saveInvoiceToS3(userId,data):
    s3 = boto3.client('s3')
    key = userId+'.json'
    bucketName='customerinvoicesserverlessbb'
    
    s3.put_object(Body=data, Bucket=bucketName, Key=key,ContentType= "application/json")
    
def isvalid_room_type(type):
    types=['deluxe','semi-deluxe','basic'];
    return type.lower() in types

def isvalid_user(userId):
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
    table = dynamodb.Table('userDetails')
    print('table name here -----')
    print(table)
    
    response = table.scan(
        FilterExpression=Attr('userName').eq(userId) & Attr('status').eq('true')
    )
    items = response['Items']
    print(response)
    
    return items     
    
def avlb_rooms(type):  
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
    table = dynamodb.Table(TABLE_NAME)
    
    response = table.scan(
        FilterExpression=Attr('type').eq(type) & Attr('available').eq('Yes')
    )
    items = response['Items']
    
    return items
    
def customer_room(roomNumber,userId):  
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
    table = dynamodb.Table(TABLE_NAME)
    
    response = table.scan(
        FilterExpression=Attr('number').eq(roomNumber) & Attr('userId').eq(userId)
    )
    items = response['Items']
    print(items)
    
    return items   
    
    
def validate_order(slots):
    type=try_ex(lambda: slots['type'])
    userId=try_ex(lambda: slots['userId'])
    roomNumber=try_ex(lambda: slots['roomNumber'])
    
    if type and not isvalid_room_type(type):
        return build_validation_result(
            False,
            'type',
            'This room-type is not valid. Please enter available room types.'
        )
    
    rooms=avlb_rooms(type)  
    
    if type and len(rooms)==0:
        return build_validation_result(
            False,
            'type',
            'Sorry! This room-type is not available. Please try some other room-type.'
        )

    usersLoggedIn=isvalid_user(userId)
    
    if userId and len(usersLoggedIn)==0:
        return build_validation_result(
            False,
            'type',
            'Please LogIn to continue with this feature.'
        )    
        
    cus_room=customer_room(roomNumber,userId)  
    
    if roomNumber and len(cus_room)==0:
        return build_validation_result(
            False,
            'roomNumber',
            'Sorry! We dont have any booking under your name with this room number.'
        )

    return {'isValid': True}
    

def build_validation_result(isvalid ,violated_slot ,message_content) :
    return {
        'isValid':isvalid,
        'violatedSlot':violated_slot,
        'message': {'contentType':'PlainText','message':message_content}
    }

def take_order(intent_request) :
    slots = intent_request['currentIntent']['slots']
    type = slots['type']
    userId=slots['userId']
    
    session_attributes = intent_request['sessionAttributes'] if intent_request['sessionAttributes'] is not None else {}
    logger.debug(intent_request['invocationSource'])
    
    if intent_request['invocationSource'] == 'DialogCodeHook':
        validation_result = validate_order(intent_request['currentIntent']['slots'])
        logger.debug(validation_result)
        if not validation_result['isValid']:
            slots[validation_result['violatedSlot']] = None
            return elicit_slot(
                session_attributes,
                intent_request['currentIntent']['name'],
                slots,
                validation_result['violatedSlot'],
                validation_result['message']['message']
            )
            
        return delegate(session_attributes,intent_request['currentIntent']['slots'])
        
    roomNumber=update_room(type,userId)   
    
    return close(
        session_attributes,
        'Fulfilled',
        {
            'contentType':'PlainText',
            'content': 'Great, your room number  '+ roomNumber +' is getting ready.'
        }
    )
    
def cancel_order(intent_request) :
    slots = intent_request['currentIntent']['slots']
    roomNumber = slots['roomNumber']
    userId = slots['userId']
    
    session_attributes = intent_request['sessionAttributes'] if intent_request['sessionAttributes'] is not None else {}
    logger.debug(intent_request['invocationSource'])
    
    if intent_request['invocationSource'] == 'DialogCodeHook':
        validation_result = validate_order(intent_request['currentIntent']['slots'])
        logger.debug('validation result is: ')
        logger.debug(validation_result)
        if not validation_result['isValid']:
            slots[validation_result['violatedSlot']] = None
            return elicit_slot(
                session_attributes,
                intent_request['currentIntent']['name'],
                slots,
                validation_result['violatedSlot'],
                validation_result['message']['message']
            )
            
        return delegate(session_attributes,intent_request['currentIntent']['slots'])
    
    roomId=customer_room(roomNumber,userId)[0]['id'] 
    print(roomId)
    delete_room(roomId)   
    
    return close(
        session_attributes,
        'Fulfilled',
        {
            'contentType':'PlainText',
            'content': 'Okay, your booking has been cancelled!'
        }
    )    
    
def dispatch(intent_request) :
    logger.debug ('dispatch userId= {},intentName={}'.format(intent_request['userId'], intent_request['currentIntent']['name']))
    intent_name = intent_request['currentIntent']['name']
    
    if intent_name=='BookHotel_dev':
        return take_order(intent_request)
    if intent_name=='CancelBookHotel_dev':
        return cancel_order(intent_request)    
        
    raise Exception('Intent with name'+ intent_name+ 'not supported')    

def lambda_handler(event, context):
    os.environ['TZ']='America/New_York'
    time.tzset()
    logger.debug('event.bot.name={}'.format(event['bot']['name']))
    return dispatch(event)

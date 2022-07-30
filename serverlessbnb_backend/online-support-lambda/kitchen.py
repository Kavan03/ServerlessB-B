import logging
import boto3
import uuid
import json
import datetime
import time
import os
import dateutil.parser
import csv
import io

# code references: https://aws-ml-blog.s3.amazonaws.com/artifacts/lex-fallback-intent/lambda_function.py, https://stackoverflow.com/questions/64221100/limit-and-sort-dynamodb-results-with-filterexpression-python, https://www.youtube.com/watch?v=eqj-dHXYH2A, https://www.youtube.com/watch?v=LZYDn5smlYg, https://www.youtube.com/watch?v=6ELHyv4-ioo

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

dyn_client = boto3.client('dynamodb')
TABLE_NAME = 'Kitchen'


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
 
dishes_costs={'chicken':20,'mutton':22,'bread':5,'naan':3,'pav bhaji':18,'chole':14,'fish':19,'paneer':21}    
def save_order(dish,quantity,userId):
    id = str (uuid.uuid4())
    
    data=dyn_client.put_item(
        TableName=TABLE_NAME,
        Item={
            'id':{
                'S': id
            },
            'dish':{
                'S': dish
            },
            'quantity':{
                'S': quantity
            },
            'cost':{
                'S': str((int(quantity))*dishes_costs[dish])
            },
            'userId':{
                'S': userId
            }
        }
        
    )
    
    
    ordered_dish={'id':id,'dish':dish,'quantity':quantity,'cost':str((int(quantity))*dishes_costs[dish]),'userId':userId}
    print(ordered_dish)
    saveInvoiceToS3(userId,str(ordered_dish))   

def saveInvoiceToS3(userId,data):
    s3 = boto3.client('s3')
    key = userId+'.json'
    bucketName='customerinvoicesserverlessbb'
    
    s3.put_object(Body=data, Bucket=bucketName, Key=key,ContentType= "application/json")
    
    
def isvalid_dish_type(dish):
    dishes=['chicken','mutton','bread','naan','pav bhaji','chole','fish','paneer'];
    return dish.lower() in dishes

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
    
def validate_order(slots):
    dish=try_ex(lambda: slots['dish'])
    quantity=safe_int(try_ex(lambda: slots['quantity']))
    
    if quantity is not None and (quantity < 1 or quantity > 10):
        return build_validation_result(
            False,
            'quantity',
            'quantity must be 1 to 10'
        )

    usersLoggedIn=isvalid_user(userId)
    
    if userId and len(usersLoggedIn)==0:
        return build_validation_result(
            False,
            'type',
            'Please LogIn to continue with this feature.'
        )    
    
    if dish and not isvalid_dish_type(dish):
        return build_validation_result(
            False,
            'dish',
            'This dish is not available. Please try some other dish.'
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
    dish = slots['dish']
    quantity = slots['quantity']
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
        
    save_order(dish,quantity,userId)   
    
    return close(
        session_attributes,
        'Fulfilled',
        {
            'contentType':'PlainText',
            'content': 'Thanks, we have received your order!'+' Your total amount is : ' + str((int(quantity))*dishes_costs[dish])
        }
    )
    
def dispatch(intent_request) :
    logger.debug ('dispatch userId= {},intentName={}'.format(intent_request['userId'], intent_request['currentIntent']['name']))
    intent_name = intent_request['currentIntent']['name']
    
    if intent_name=='Kitchen_dev':
        return take_order(intent_request)
        
    raise Exception('Intent with name'+ intent_name+ 'not supported')    

def lambda_handler(event, context):
    os.environ['TZ']='America/New_York'
    time.tzset()
    logger.debug('event.bot.name={}'.format(event['bot']['name']))
    return dispatch(event)

const AWS = require('aws-sdk')

exports.handler = async (event) => {
  const body = JSON.parse(event.body)
  try {
    var ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' })

    const isTableExist = await checkTable(ddb)
    if (!isTableExist) {
      await createTable(ddb)
    }

    await uploadItemToTable(body, ddb)

    var SNSClient = new AWS.SNS({
      apiVersion: '2010-03-31',
      region: 'us-east-1',
    })

    const snsParams = {
      Subject: 'Booked tour package',
      Message: `Hello, \nHope you are doing fine! \nplease find the details of final tour booking!!
      \n\nPlace City: ${body.placeCity}\nPlace Name: ${body.placeName}\nTour time: ${body.tourTime}\nTour Price: ${body.tourPrice}`,
      TopicArn: 'arn:aws:sns:us-east-1:403229885123:ServerlessbnbSnsTopic',
      MessageStructure: 'string',
      MessageAttributes: {
        email: {
          DataType: 'String',
          StringValue: body.userEmail,
        },
      },
    }

    const snsData = await SNSClient.publish(snsParams).promise()
    console.log('snsData => ', snsData)
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
      }),
    }
  } catch (e) {
    console.log('error==', e)
  }
}

const createTable = async (ddb) => {
  var ddbTableParams = {
    AttributeDefinitions: [
      {
        AttributeName: 'userName',
        AttributeType: 'S',
      },
    ],
    KeySchema: [
      {
        AttributeName: 'userName',
        KeyType: 'HASH',
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
    TableName: 'Confirm_tour_table',
    StreamSpecification: {
      StreamEnabled: false,
    },
  }

  await ddb
    .createTable(ddbTableParams)
    .promise()
    .then((data) => {
      return data
    })
    .catch((error) => {
      console.log('Error', error)
    })
}

const checkTable = async (ddb) => {
  console.log('Check table: ', 'Confirm_tour_table')
  var params = {
    TableName: 'Confirm_tour_table',
  }

  await ddb
    .describeTable(params)
    .promise()
    .then((data) => {
      return 'true'
    })
    .catch((error) => {
      return 'false'
    })
}

const uploadItemToTable = async (fileData, ddb) => {
  var getParams = {
    TableName: 'Confirm_tour_table',
    Key: {
      userName: { S: fileData.userName },
    },
  }

  // Call DynamoDB to read the item from the table
  const filteredItem = await ddb
    .getItem(getParams)
    .promise()
    .then((data) => {
      return data.Item
    })
    .catch((error) => {
      console.log('Error', error)
    })
  var params
  if (filteredItem) {
    params = {
      TableName: 'Confirm_tour_table',
      Key: {
        userName: { S: fileData.userName },
      },
      UpdateExpression: 'set #a = :x, #b = :y, #c = :z, #d = :w',
      ExpressionAttributeNames: {
        '#a': 'placeCity',
        '#b': 'placeName',
        '#c': 'tourTime',
        '#d': 'tourPrice',
      },
      ExpressionAttributeValues: {
        ':x': { S: fileData.placeCity.toString() },
        ':y': { S: fileData.placeCity.toString() },
        ':z': { N: fileData.tourTime.toString() },
        ':w': { N: fileData.tourPrice.toString() },
      },
    }

    const updateData = await ddb
      .updateItem(params)
      .promise()
      .then((data) => {
        return data
      })
      .catch((error) => {
        console.log('Error', error)
      })
  } else {
    params = {
      TableName: 'Confirm_tour_table',
      Item: {
        userName: { S: fileData.userName.toString() },
        userEmail: { S: fileData.userEmail.toString() },
        placeCity: { S: fileData.placeCity.toString() },
        placeName: { S: fileData.placeName.toString() },
        tourTime: { N: fileData.tourTime.toString() },
        tourPrice: { N: fileData.tourPrice.toString() },
      },
    }

    await ddb
      .putItem(params)
      .promise()
      .then((data) => {
        return data
      })
      .catch((error) => {
        console.log('Error', error)
      })
  }
}

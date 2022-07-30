const AWS = require('aws-sdk')

exports.handler = async (event) => {
  var email = JSON.parse(event.body).email
  try {
    var snsParams = {
      Protocol: 'EMAIL',
      TopicArn: 'arn:aws:sns:us-east-1:403229885123:ServerlessbnbSnsTopic',
      Endpoint: email,
      ReturnSubscriptionArn: true,
    }

    var SNSClient = new AWS.SNS({
      apiVersion: '2010-03-31',
      region: 'us-east-1',
    })
    var subscribePromiseResult = await SNSClient.subscribe(snsParams).promise()
    console.log('Subscription ARN is ' + subscribePromiseResult)

    var setSubParams = {
      AttributeName: 'FilterPolicy',
      SubscriptionArn: subscribePromiseResult.SubscriptionArn,
      AttributeValue: '{ "email": [ "' + email + '" ] }',
    }

    var subscribePromiseAttri = new AWS.SNS({
      apiVersion: '2010-03-31',
      region: 'us-east-1',
    })
      .setSubscriptionAttributes(setSubParams)
      .promise()

    subscribePromiseAttri
      .then(function (data) {
        console.log('subscribePromiseAttri => ', data)
      })
      .catch(function (err) {
        console.error(err, err.stack)
      })
  } catch (e) {
    console.log('error==', e)
  }
}

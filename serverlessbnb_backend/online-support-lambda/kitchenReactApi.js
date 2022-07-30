const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

// code references : https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-dynamo-db.html, https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/dynamodb-example-query-scan.html

AWS.config.update({ region: "us-east-1" });

const ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

exports.handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json"
  };

  try {
    switch (event.routeKey) {
      case "GET /kitchen/{userId}":
          
        const params = {
             FilterExpression: "userId = :u",
            ExpressionAttributeValues: {
            ":u": {S: event.pathParameters.userId}
            },
            ExpressionAttributeNames: {
            '#d': 'dish',
            '#q': 'quantity',
            },
            ProjectionExpression: "cost,#d,#q",
            TableName: "Kitchen",
        };  
        
        body = await ddb.scan(params, function (err, data) {
        if (err) {
          console.log("Error", err);
        } else {
            console.log("Success", data.Count);
        }
      }).promise();
        break;
      default:
        throw new Error(`Unsupported route: "${event.routeKey}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers
  };
};

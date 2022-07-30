require("dotenv").config();
const publisher = require("./publishMessage");
const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb"); // CommonJS import
const REGION = "us-east-1";
const client = new DynamoDBClient({ region: REGION });


exports.handler = async (event) => {
  console.log(event.Records);
  console.log(event.Records[0].dynamodb);
  const table = event.Records[0].eventSourceARN.split(":")[5].split("/")[1];
  const Key = event.Records[0].dynamodb.Keys;
  console.log(table);
  console.log(Key);
  const params = {
    TableName: table,
    Key,
    EventName: event.Records[0].eventName,
    EventSourceARN: event.Records[0].eventSourceARN,
    EventID: event.Records[0].eventID
  };
  const data = JSON.stringify(params);
  // console.log(params);
  // const command = new GetItemCommand(params);
  // console.log("command", command);
  // const response = await client.send(command);
  // console.log("res", response);
  // const data = (await response).Item;
  console.log(data);
  const topicNameOrId = "projects/csci-5410-group-project/topics/bookRoom";
  await publisher.publishMessage(topicNameOrId, data);
};

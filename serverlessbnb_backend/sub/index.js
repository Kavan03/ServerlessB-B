require("dotenv").config();
const subscriper = require("./listenMessage");
const subscriptionNameOrId =
  "projects/csci-5410-group-project/subscriptions/confirmBooking";
// const data = require("./listenMessage")
/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
// const subscriptionNameOrId = 'YOUR_SUBSCRIPTION_NAME_OR_ID';

// Imports the Google Cloud client library
// const { PubSub } = require("@google-cloud/pubsub");
const { v1 } = require("@google-cloud/pubsub");
const subClient = new v1.SubscriberClient();
// Creates a client; cache this for further use

(exports.handler = async (event) => {
  // const pubSubClient = new PubSub();
  var data = [];
  const formattedSubscription =
    subscriptionNameOrId.indexOf("/") >= 0
      ? subscriptionNameOrId
      : subClient.subscriptionPath(projectId, subscriptionNameOrId);
  const request = {
    subscription: formattedSubscription,
    maxMessages: 10,
  };
  const [response] = await subClient.pull(request);
  const ackIds = [];
  for (const message of response.receivedMessages) {
    console.log(`Received message: ${message.message.data}`);
    data.push(JSON.parse(message.message.data.toString()));
    ackIds.push(message.ackId);
  }
  if (ackIds.length !== 0) {
    // Acknowledge all of the messages. You could also acknowledge
    // these individually, but this is more efficient.
    const ackRequest = {
      subscription: formattedSubscription,
      ackIds: ackIds,
    };

    await subClient.acknowledge(ackRequest);
    let body;
    let statusCode = 200;
    let headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin":
        "https://rghx4zhafh.execute-api.us-east-1.amazonaws.com/default/sub",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    };
    try {
      switch (event.routeKey) {
        case "ANY /sub":
          body =  data
          console.log("body", body);
          console.log("stringifyBofy", JSON.stringify(body));
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
      headers,
    };
  }
})();

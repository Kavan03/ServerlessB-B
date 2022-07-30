/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
// const subscriptionNameOrId = 'YOUR_SUBSCRIPTION_NAME_OR_ID';
const timeout = 3;

// Imports the Google Cloud client library
const { PubSub} = require("@google-cloud/pubsub");
// Creates a client; cache this for further use
const pubSubClient = new PubSub();
module.exports.listenForMessages = async (subscriptionNameOrId) => {
   var data = []
  // References an existing subscription
  const subscription = await pubSubClient.subscription(subscriptionNameOrId);
  // Create an event handler to handle messages
  let messageCount = 0;
  const messageHandler = (message) => {
    data.push(message.data.toString())
    console.log(`Received message ${message.id}:`);
    console.log(`\tData: ${message.data}`);
    console.log(`\tAttributes: ${message.attributes}`);
    messageCount += 1;
    // "Ack" (acknowledge receipt of) the message
    message.ack();
  };

  // Listen for new messages until timeout is hit
  subscription.on("message", messageHandler);
  setTimeout(async () => {
    subscription.removeListener("message", messageHandler);
    console.log(`${messageCount} message(s) received.`);
    console.log(data)
    return data
  }, timeout * 1000);
};

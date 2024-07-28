const { PubSub } = require("@google-cloud/pubsub");

const projectId = "user_email_pub_sub";
const PUBSUB_EMULATOR_HOST = "localhost:8681";

// Create an instance of PubSub with the provided service account key
const pubSubClient = new PubSub({
  projectId,
  apiEndpoint: PUBSUB_EMULATOR_HOST,
});

const publishMessage = async (topicName, payload) => {
  const dataBuffer = Buffer.from(JSON.stringify(payload));
  try {
    const messageId = await pubSubClient
      .topic(topicName)
      .publishMessage({ data: dataBuffer });
    console.log(`Message ID:${messageId} published`);
    return messageId;
  } catch (error) {
    console.error(`Received error while publishing: ${error.message}`);
  }
};

const listenForPullMessages = async (subscriptionName, timeout) => {
  const subscription = pubSubClient.subscription(subscriptionName);
  let messageCount = 0;
  let data = [];
  const messageHandler = (message) => {
    const jsonData = JSON.parse(message.data);

    data.push({
      id: message.id,
      attributes: message.attributes,
      ...jsonData,
    });
    messageCount += 1;
    message.ack();
  };
  subscription.on("message", messageHandler);

  setTimeout(() => {
    console.log("Message internally pulled from client: \n", data);
    console.log(`${messageCount} message(s) received`);
    subscription.removeListener("message", messageHandler);
  }, timeout * 100);
};

const listenForPushMessages = (payload) => {
  const message = Buffer.from(payload, "base64").toString("utf-8");
  let parsedMessage = JSON.parse(message);
  console.log("Message externally pushed from GCP: \n", parsedMessage);
  return parsedMessage;
};

module.exports = {
  publishMessage,
  listenForPullMessages,
  listenForPushMessages,
};

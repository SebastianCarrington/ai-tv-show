import { MongoClient } from "mongodb";
import { config } from "dotenv";

// Connect to MongoDB server

config();

const mongoClient = await client(process.env.DB_URI);

async function client(uri) {
  let mongoClient;

  try {
    mongoClient = new MongoClient(uri);
    console.log("Connecting to MongoDB...");
    await mongoClient.connect();
    console.log("Successfully connected to MongoDB");

    return mongoClient;
  } catch (error) {
    console.error("Connection to MongoDB failed: ", error);
    process.exit();
  }
}

export async function addTopic(topic, characters) {
  const result = await mongoClient
    .db(process.env.DB_NAME)
    .collection("proposed-topics")
    .insertOne({
      topic: topic,
      characters: characters,
    });

  console.log(
    `New listing created with the following id: ${result.insertedId}`
  );
}

export async function removeTopic(topic) {
  const found_topic = await mongoClient
    .db(process.env.DB_NAME)
    .collection("proposed-topics")
    .findOne({ topic: topic });

  const result1 = await mongoClient
    .db(process.env.DB_NAME)
    .collection("topic-archive")
    .insertOne({
      topic: found_topic.topic,
      characters: found_topic.characters,
    });

  console.log(
    `New archived topic created with the following id: ${result1.insertedId}`
  );

  await mongoClient
    .db(process.env.DB_NAME)
    .collection("proposed-topics")
    .deleteOne({ topic: topic });
}

export async function sendCompletedScript(name, characters, script) {
  const result = await mongoClient
    .db(process.env.DB_NAME)
    .collection("completed-scripts")
    .insertOne({
      name: name,
      characters: characters,
      text: script,
    });

  console.log(
    `New listing created with the following id: ${result.insertedId}`
  );
}

export async function getProposedTopic() {
  const topic = await mongoClient
    .db(process.env.DB_NAME)
    .collection("proposed-topics")
    .findOne();

  return topic;
}

export async function getScript() {
  const script = await mongoClient
    .db(process.env.DB_NAME)
    .collection("completed-scripts")
    .findOne();

  return script;
}

export async function archiveScript(name) {
  const found_script = await mongoClient
    .db(process.env.DB_NAME)
    .collection("completed-scripts")
    .findOne({ name: name });

  const result = await mongoClient
    .db(process.env.DB_NAME)
    .collection("script-archive")
    .insertOne({
      name: found_script.name,
      text: found_script.text,
    });

  console.log(
    `New archived script created with the following id: ${result.insertedId}`
  );

  await mongoClient
    .db(process.env.DB_NAME)
    .collection("completed-scripts")
    .deleteOne({ name: name });
}

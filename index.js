import * as mongo from "./managers/mongo-manager.js";
import * as story from "./managers/story-manager.js";
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });
const unity_wss = new WebSocketServer({ port: 8081 });
let verified = false;
let verified1 = false;

wss.on("connection", (ws) => {
  ws.on("error", console.error);

  ws.on("message", async (data) => {
    if (data.toString() == "lol") {
      verified = true;
      console.log("lol");
    }

    if (verified && data.toString() != "lol") {
      const data1 = JSON.parse(data.toString());
      const topic = data1.topic.topic;
      const characters = data1.topic.characters;
      const characters1 = [];

      for (let i = 0; i <= characters.length - 1; i++) {
        if (characters[i] != null) {
          characters1.push(characters[i]);
        }
      }
      try {
        //console.log(data1);
        mongo.addTopic(topic, characters1);

        const script = await story.generateScript();
        mongo.sendCompletedScript(
          script.title,
          script.characters,
          script.lines
        );
      } catch (e) {
        console.log(`An error occurred: ${e}`);
      }
    }
  });
});

wss.on("close", () => {
  verified = false;
});

unity_wss.on("connection", (ws) => {
  ws.on("error", console.error);

  ws.on("message", async (data) => {
    if (data.toString() == "lol") {
      verified1 = true;
      console.log("lol");
    }

    if (verified1 && data.toString() == "request script") {
      console.log("Received request...");
      const script = await mongo.getScript();
      const script_string = JSON.stringify(script);
      try {
        ws.send(script_string);
        console.log(`Sending Unity script "${script.name}".`);
        mongo.archiveScript(script.name);
      } catch (e) {
        console.log(`An Error Occurred: ${e}`);
      }
    }
  });
});

unity_wss.on("close", () => {
  verified1 = false;
});

/*mongo.addTopic("patrick has discovered that he can only say the word shit", [
  "spongebob",
  "patrick",
]);*/

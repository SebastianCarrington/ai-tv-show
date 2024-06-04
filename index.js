import * as mongo from "./managers/mongo-manager.js";
import * as story from "./managers/story-manager.js";
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });
let verified = false;

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

      //console.log(data1);
      mongo.addTopic(topic, characters1);

      const script = await story.generateScript();
      mongo.sendCompletedScript(script.title, script.lines);
    }
  });
});

/*mongo.addTopic("patrick has discovered that he can only say the word shit", [
  "spongebob",
  "patrick",
]);*/

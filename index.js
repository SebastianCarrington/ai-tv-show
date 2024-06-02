import * as mongo from "./managers/mongo-manager.js";
import * as story from "./managers/story-manager.js";
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);

  ws.on("message", function message(data) {
    console.log("received: %s", data);
    ws.send("lol");
  });
});

/*mongo.addTopic("patrick has discovered that he can only say the word shit", [
  "spongebob",
  "patrick",
]);*/

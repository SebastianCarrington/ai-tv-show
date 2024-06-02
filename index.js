import * as mongo from "./managers/mongo-manager.js";
import * as story from "./managers/story-manager.js";

/*mongo.addTopic("patrick has discovered that he can only say the word shit", [
  "spongebob",
  "patrick",
]);*/

const script = await story.generateScript();
mongo.sendCompletedScript(script.title, script.lines);

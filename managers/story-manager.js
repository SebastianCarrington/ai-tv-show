import OpenAI from "openai";
import * as mongo from "./mongo-manager.js";

const openai = new OpenAI();

export async function generateScript() {
  const proposedTopic = await mongo.getProposedTopic();
  const topic = proposedTopic.topic;
  const characters = proposedTopic.characters;

  const message = `Create a sitcom scene script that only includes ${characters}. There should be no extra characters other than the ones listed. The script should have a title formatted Title: show title. The topic is "${topic}"`;

  console.log(`Generating script "${topic}" with characters ${characters}...`);

  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: message }],
    model: "gpt-3.5-turbo",
  });

  const script_raw = completion.choices[0].message.content.split("\n");

  /*
  const script_raw = [
    "Title: Curse of F$",
    "SpongeBob: Hey, Patrick! You ready for another day of work?",
    "Patrick: F$ck!",
    "SpongeBob: Woah, what's going on, Patrick? Why are you saying that?",
    "Patrick: F$ck! F$ck! F$ck!",
    `SpongeBob: Oh no, Patrick! You're cursed! You can only say the word "F$ck"!`,
    "Patrick: F$ck!",
    'SpongeBob: Mr. Krabs, Patrick is under a curse! He can only say the word "F$ck"!',
    "Mr. Krabs: Oh no, this is terrible! How did this happen?",
    "SpongeBob: I don't know, but we need to find a way to break the curse!",
    "Sandy: Well, I reckon I can help y'all break that curse. But it won't be easy.",
    "SpongeBob: What do we need to do, Sandy?",
    "Sandy: We need to find the magical F$cking flower that only blooms once a year. It's the only thing that can break the curse.",
    "SpongeBob: Look, Patrick! There it is, the F$cking flower!",
    "Patrick: F$ck! F$ck! F$ck!",
    "SpongeBob: Here, Patrick, eat this flower. It will break the curse.",
    "Patrick: Wow, that was a f$cking crazy adventure!",
    "SpongeBob: Haha, it sure was, Patrick.",
  ];
*/

  const script_parsed_once = [];

  for (var i = 0; i <= script_raw.length - 1; i++) {
    if (
      !(
        script_raw[i] == "" ||
        script_raw[i].split("")[0] == "[" ||
        script_raw[i].split("")[0] == "(" ||
        script_raw[i].split(" ")[0] == "Title" ||
        script_raw[i].split(" ")[0] == "Spoken"
      )
    ) {
      script_parsed_once.push(script_raw[i]);
    }
  }

  const script = {
    title: script_raw[0].split(": ")[1],
    lines: [],
  };

  for (var i = 1; i <= script_parsed_once.length - 1; i++) {
    const line_parsed_once = script_parsed_once[i].split(": ");

    //console.log(line_parsed_once);
    const character = line_parsed_once[0];
    const speech = line_parsed_once[1];

    script.lines.push({
      character: character,
      speech: speech,
    });
  }

  console.log("Completed!");
  mongo.removeTopic(topic);

  return script;
}

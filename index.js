const Alexa = require("alexa-sdk");
const fs = require("fs");
const yaml = require("js-yaml");

const REPROMPT_MSG = "Try asking a question about the object.";
const STATES = {
  "GAME": 0,
};

const launchHandlers = {
  "NewSession": function () {
    this.handler.state = STATES.GAME;
    this.attributes.objectKey = getRandomNum(0, objects.length - 1);
    this.emit(
      ":ask",
      "Oh no! Thief Monkey stole something. He'll only give it back if you"
      + " guess what it is.",
      REPROMPT_MSG
    );
  },
};

const gameHandlers = Alexa.CreateStateHandler(STATES.GAME, {
  "AMAZON.HelpIntent": function () {
    this.emit(
      ":ask",
      "You can ask a question about the object. Or you can guess what the"
        + " object is.",
      REPROMPT_MSG
    );
  },
  "AMAZON.StopIntent": function () {
    this.emit(
      ":tell",
      "Thief Monkey says goodbye. Oh, and he's selling your stuff on eBay.",
      REPROMPT_MSG
    );
  },
  "AskCategoryIntent": function () {
    this.emit(
      ":ask",
      `It's a ${objects[this.attributes.objectKey].category}`,
      REPROMPT_MSG
    );
  },
  "AskColorIntent": function () {
    this.emit(
      ":ask",
      `It's ${objects[this.attributes.objectKey].color}`,
      REPROMPT_MSG
    );
  },
  "AskFirstLetterIntent": function () {
    const firstLetter = objects[this.attributes.objectKey].name[0];
    this.emit(
      ":ask",
      `Its name begins with the letter ${firstLetter}`,
      REPROMPT_MSG
    );
  },
  "AskLastLetterIntent": function () {
    const lastLetter = objects[this.attributes.objectKey].name.slice(-1);
    this.emit(
      ":ask",
      `Its name ends with the letter ${lastLetter}`,
      REPROMPT_MSG
    );
  },
  "AskNumLettersIntent": function () {
    const numLetters = objects[this.attributes.objectKey].name.length;
    this.emit(
      ":ask",
      `There are ${numLetters} letters in its name`,
      REPROMPT_MSG
    );
  },
  "AskRoomIntent": function () {
    this.emit(
      ":ask",
      `It was in the ${objects[this.attributes.objectKey].room}`,
      REPROMPT_MSG
    );
  },
  "AskShapeIntent": function () {
    this.emit(
      ":ask",
      `It has a ${objects[this.attributes.objectKey].shape} shape`,
      REPROMPT_MSG
    );
  },
  "AskSizeIntent": function () {
    this.emit(
      ":ask",
      `It's ${objects[this.attributes.objectKey].size}`,
      REPROMPT_MSG
    );
  },
  "AskTextureIntent": function () {
    this.emit(
      ":ask",
      `It has a ${objects[this.attributes.objectKey].texture} texture`,
      REPROMPT_MSG
    );
  },
  "AskValueIntent": function () {
    this.emit(
      ":ask",
      `It's worth ${objects[this.attributes.objectKey].value}`,
      REPROMPT_MSG
    );
  },
  "AskWeightIntent": function () {
    this.emit(
      ":ask",
      `It's ${objects[this.attributes.objectKey].weight}`,
      REPROMPT_MSG
    );
  },
  "GuessObjectIntent": function () {
    const correctName = objects[this.attributes.objectKey].name;
    const guessedName = this.event.request.intent.slots.object.value;
    if (guessedName === correctName) {
      const oldObjectKey = this.attributes.objectKey;

      do {
        this.attributes.objectKey = getRandomNum(0, objects.length - 1);
      } while (this.attributes.objectKey === oldObjectKey);

      this.emit(
        ":ask",
        `You guessed it! Thief Monkey stole your ${correctName}. The good news`
          + ` is he put it back. The bad news is he stole something else`
          + ` instead. Can you guess what he took this time?`
      );
      return;
    }

    this.emit(
      ":ask",
      `No. Thief Monkey didn't steal your ${guessedName}. Keep guessing.`,
      REPROMPT_MSG
    );
  },
  "Unhandled": function () {
    this.emit(
      ":ask",
      "I'm sorry. I have no idea what you just said.",
      REPROMPT_MSG
    );
  },
});

const objects = yaml.safeLoad(fs.readFileSync("objects.yaml")).objects;

const getRandomNum = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

exports.handler = function (event, context, callback) {
  const alexa = Alexa.handler(...arguments);

  alexa.registerHandlers(launchHandlers, gameHandlers);
  alexa.execute();
};

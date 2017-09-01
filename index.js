const Alexa = require("alexa-sdk");
const fs = require("fs");
const yaml = require("js-yaml");

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
      + " guess what it is."
    );
  },
};

const gameHandlers = Alexa.CreateStateHandler(STATES.GAME, {
  "AskCategoryIntent": function () {
    this.emit(
      ":ask",
      `It's a ${objects[this.attributes.objectKey].category}`
    );
  },
  "AskColorIntent": function () {
    this.emit(
      ":ask",
      `It's ${objects[this.attributes.objectKey].color}`
    );
  },
  "AskFirstLetterIntent": function () {
    const firstLetter = objects[this.attributes.objectKey].name[0];
    this.emit(
      ":ask",
      `Its name begins with the letter ${firstLetter}`
    );
  },
  "AskLastLetterIntent": function () {
    const lastLetter = objects[this.attributes.objectKey].name.slice(-1);
    this.emit(
      ":ask",
      `Its name ends with the letter ${lastLetter}`
    );
  },
  "AskNumLettersIntent": function () {
    const numLetters = objects[this.attributes.objectKey].name.length;
    this.emit(
      ":ask",
      `There are ${numLetters} letters in its name`
    );
  },
  "AskRoomIntent": function () {
    this.emit(
      ":ask",
      `It was in the ${objects[this.attributes.objectKey].room}`
    );
  },
  "AskShapeIntent": function () {
    this.emit(
      ":ask",
      `It has a ${objects[this.attributes.objectKey].shape} shape`
    );
  },
  "AskSizeIntent": function () {
    this.emit(
      ":ask",
      `It's ${objects[this.attributes.objectKey].size}`
    );
  },
  "AskTextureIntent": function () {
    this.emit(
      ":ask",
      `It has a ${objects[this.attributes.objectKey].texture} texture`
    );
  },
  "AskValueIntent": function () {
    this.emit(
      ":ask",
      `It's worth ${objects[this.attributes.objectKey].value}`
    );
  },
  "AskWeightIntent": function () {
    this.emit(
      ":ask",
      `It's ${objects[this.attributes.objectKey].weight}`
    );
  },
  "Unhandled": function () {
    this.emit(":tell", "I'm sorry. I have no idea what you just said.");
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

const Alexa = require("alexa-sdk");

const STATES = {
  "GAME": 0,
};

const launchHandlers = {
  "NewSession": function handleNewSession () {
    this.handler.state = STATES.GAME;
    this.emit(
      ":ask",
      "Oh no! Thief Monkey stole something. He'll only give it back if you"
      + " guess what it is."
    );
  },
};

const gameHandlers = Alexa.CreateStateHandler(STATES.GAME, {
  "GetStolenItem": function handleTempIntent () {
    this.emit(":tell", "Thief Monkey is up to no good.");
  },
  "Unhandled": function handleUnhandledIntent () {
    this.emit(":tell", "I'm sorry. I have no idea what you just said.");
  },
});

exports.handler = function handler (event, context, callback) {
  const alexa = Alexa.handler(...arguments);

  alexa.registerHandlers(launchHandlers, gameHandlers);
  alexa.execute();
};

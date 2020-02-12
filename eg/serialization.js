// Be sure to "npm install johnny-five"
const five = require("johnny-five");
/**
 *  const Weather = require("j5-sparkfun-weather-shield")(five);
 */
const Weather = require("../")(five);
const board = new five.Board();

board.on("ready", () => {
  const weather = new Weather({
    variant: "DEV-13956",
    freq: 200
  });

  weather.on("data", () => {
    console.log(JSON.stringify(weather, null, 2));
  });
});

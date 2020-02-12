const five = require("johnny-five");
/**
 *  const Weather = require("j5-sparkfun-weather-shield")(five);
 */
const Weather = require("../")(five);
const board = new five.Board();

board.on("ready", () => {
  const weather = new Weather({
    variant: "ARDUINO",
    freq: 200
  });

  weather.on("data", () => {
    console.log(JSON.stringify(weather, null, 2));
  });
});

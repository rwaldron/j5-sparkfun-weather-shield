var five = require("johnny-five");
/**
 *  var Weather = require("j5-sparkfun-weather-shield")(five);
 */
var Weather = require("../")(five);
var board = new five.Board();

board.on("ready", function() {
  var weather = new Weather({
    variant: "ARDUINO",
    freq: 200
  });

  weather.on("data", function() {
    console.log(JSON.stringify(this, null, 2));
  });
});

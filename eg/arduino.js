var five = require("johnny-five");
/**
 *  var Weather = require("j5-sparkfun-weather-shield")(five);
 */
var Weather = require("../")(five);
var board = new five.Board();

board.on("ready", function() {
  var weather = new Weather({
    platform: "ARDUINO",
    freq: 200
  });

  weather.on("data", function() {
    console.log("  celsius: ", this.celsius);
    console.log("  fahrenheit: ", this.fahrenheit);
    console.log("  kelvin: ", this.kelvin);
    console.log("  pressure: ", this.pressure);
    console.log("  feet: ", this.feet);
    console.log("  meters: ", this.meters);
    console.log("  relativeHumidity: ", this.relativeHumidity);
    console.log("----------------------------------------");
  });
});

var five = require("johnny-five");
/**
 *  var Weather = require("j5-sparkfun-weather-shield")(five);
 */
var Weather = require("../")(five);
var board = new five.Board();

board.on("ready", function() {
  var weather = new Weather({
    variant: "ARDUINO",
    freq: 200,
    // change elevation with whatever is reported
    // on http://www.whatismyelevation.com/.
    // `12` is the elevation (meters) for where I live in Brooklyn
    elevation: 12,
  });

  // Including elevation for altitude readings will
  // incure an additional 3 second calibration time.
  weather.on("data", function() {
    console.log("celsius: %d°C", this.celsius);
    console.log("fahrenheit: %d°F", this.fahrenheit);
    console.log("kelvin: %d°K", this.kelvin);
    console.log("pressure: %d kPa", this.pressure);
    console.log("feet: %d'", this.feet);
    console.log("meters: %d", this.meters);
    console.log("relativeHumidity: %d RH", this.relativeHumidity);
    console.log("lightLevel: %d%", this.lightLevel);
    console.log("----------------------------------------");
  });
});

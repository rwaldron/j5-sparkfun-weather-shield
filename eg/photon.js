var Particle = require("particle-io");
var five = require("johnny-five");
/**
 *  var Weather = require("j5-sparkfun-weather-shield")(five);
 */
var Weather = require("../")(five);
var board = new five.Board({
  io: new Particle({
    token: process.env.PARTICLE_TOKEN,
    deviceId: process.env.PARTICLE_PHOTON_REDBOARD_1
  })
});

board.on("ready", function() {
  var weather = new Weather({
    variant: "ARDUINO",
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

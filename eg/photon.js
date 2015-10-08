var Particle = require("particle-io");
var five = require("johnny-five");
/**
 *  var Weather = require("j5-sparkfun-weather-shield")(five);
 */
var Weather = require("../")(five);
var board = new five.Board({
  io: new Particle({
    token: process.env.PARTICLE_TOKEN,
    deviceId: process.env.PARTICLE_PHOTON_DEVICE
  })
});

board.on("ready", function() {
  var weather = new Weather({
    variant: "PHOTON",
    freq: 200
  });

  weather.on("data", function() {
    console.log("celsius: %d°C", this.celsius);
    console.log("fahrenheit: %d°F", this.fahrenheit);
    console.log("kelvin: %d°K", this.kelvin);
    console.log("pressure: %d kPa", this.pressure);
    console.log("feet: %d\"", this.feet);
    console.log("meters: %d", this.meters);
    console.log("relativeHumidity: %d RH", this.relativeHumidity);
    console.log("lightLevel: %d%", this.lightLevel);
    console.log("----------------------------------------");
  });
});

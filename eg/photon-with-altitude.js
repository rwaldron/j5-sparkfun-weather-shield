const Particle = require("particle-io");
const five = require("johnny-five");
/**
 *  const Weather = require("j5-sparkfun-weather-shield")(five);
 */
const Weather = require("../")(five);
const board = new five.Board({
  io: new Particle({
    token: process.env.PARTICLE_TOKEN,
    deviceId: process.env.PARTICLE_PHOTON_1
  })
});

board.on("ready", () => {
  const weather = new Weather({
    variant: "PHOTON",
    period: 200,
    // Set your base elevation with a value in meters,
    // as reported by http://www.whatismyelevation.com/.
    // `5` is the elevation (meters) of the
    // Bocoup office in downtown Boston
    elevation: 5,
  });

  // Including elevation for altitude readings will
  // incure an additional 3 second calibration time.
  weather.on("data", () => {
    const {
      celsius,
      fahrenheit,
      kelvin,
      pressure,
      feet,
      meters,
      relativeHumidity,
      lightLevel
    } = weather;

    console.log("celsius: %d°C", celsius);
    console.log("fahrenheit: %d°F", fahrenheit);
    console.log("kelvin: %d°K", kelvin);
    console.log("pressure: %d kPa", pressure);
    console.log("feet: %d'", feet);
    console.log("meters: %d", meters);
    console.log("relativeHumidity: %d RH", relativeHumidity);
    console.log("lightLevel: %d%", lightLevel);
    console.log("----------------------------------------");
  });
});

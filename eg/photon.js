// Be sure to "npm install johnny-five particle-io"
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
    variant: "DEV-13674",
    period: 200,
  });

  weather.on("data", () => {
    const {
      celsius,
      fahrenheit,
      kelvin,
      pressure,
      relativeHumidity,
      lightLevel
    } = weather;

    console.log("celsius: %d°C", celsius);
    console.log("fahrenheit: %d°F", fahrenheit);
    console.log("kelvin: %d°K", kelvin);
    console.log("pressure: %d kPa", pressure);
    console.log("relativeHumidity: %d RH", relativeHumidity);
    console.log("lightLevel: %d%", lightLevel);
    console.log("----------------------------------------");
  });
});

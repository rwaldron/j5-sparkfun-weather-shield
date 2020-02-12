const five = require("johnny-five");
/**
 *  const Weather = require("j5-sparkfun-weather-shield")(five);
 */
const Weather = require("../")(five);
const board = new five.Board();

board.on("ready", () => {
  const weather = new Weather({
    variant: "ARDUINO",
    freq: 200,
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

# SparkFun Weather Shield


[![Build Status](https://travis-ci.org/rwaldron/j5-sparkfun-weather-shield.svg?branch=master)](https://travis-ci.org/rwaldron/j5-sparkfun-weather-shield)

For use with [Johnny-Five](https://github.com/rwaldron/johnny-five).


- [SparkFun Weather Shield](https://www.sparkfun.com/products/12081)
  + Humidity/Temperature Sensor - HTU21D
  + Barometric Pressure - MPL3115A2
  + Light Sensor - ALS-PT19
- [SparkFun Photon Weather Shield](https://www.sparkfun.com/products/13630)
  + Humidity/Temperature Sensor - HTU21D
  + Barometric Pressure - MPL3115A2

## API & Documentation

Install with: 

```
npm install johnny-five particle-io j5-sparkfun-weather-shield
```


### Weather 

The `Weather` class constructs objects that represent the built-in components of the shield.

#### Parameters

| Property   | Type      | Value(s)/Description      | Default | Required |
|------------|-----------|---------------------------|---------|----------|
| variant    | string    | ARDUINO, PHOTON           |         | yes      |
| freq       | number    | Milliseconds. The rate in milliseconds to emit the data event |    25ms     | no      |

#### Usage

Using the Arduino shield: 

```js
var five = require("johnny-five");
var Weather = require("j5-sparkfun-weather-shield")(five);
var board = new five.Board();

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
```


Using the Photon shield: 

```js
var Particle = require("particle-io");
var five = require("johnny-five");
var Weather = require("j5-sparkfun-weather-shield")(five);
var board = new five.Board({
  io: new Particle({
    token: process.env.PARTICLE_TOKEN,
    deviceId: process.env.PARTICLE_PHOTON_REDBOARD_1
  })
});

board.on("ready", function() {
  var weather = new Weather({
    variant: "PHOTON",
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
```




## NOTE

The examples shown here are provided for illustration and do no specifically indicate variant  support. This component class is expected to work with any variant  that has I2C support. 

# SparkFun Weather Shield


[![Build Status](https://travis-ci.org/rwaldron/j5-sparkfun-weather-shield.svg?branch=master)](https://travis-ci.org/rwaldron/j5-sparkfun-weather-shield)

For use with [Johnny-Five](https://github.com/rwaldron/johnny-five).


- [SparkFun Weather Shield](https://www.sparkfun.com/products/12081)
  + Humidity/Temperature Sensor - HTU21D
  + Barometric Pressure - MPL3115A2
  + Light Sensor - ALS-PT19
  ![](https://cdn.sparkfun.com//assets/parts/8/7/0/7/12081-01.jpg)
  
- [SparkFun Photon Weather Shield](https://www.sparkfun.com/products/13630)
  + Humidity/Temperature Sensor - HTU21D
  + Barometric Pressure - MPL3115A2
  ![](https://cdn.sparkfun.com//assets/parts/1/1/0/1/7/13630-01a.jpg)

## API & Documentation

Install with: 

```
npm install johnny-five particle-io j5-sparkfun-weather-shield
```


### Weather 

The `Weather` class constructs objects that represent the built-in components of the shield.

- Shorthand Initialization, defaults "data" to 25ms intervals
  ```js
  var weather = new Weather("ARDUINO");

  ...or...

  var weather = new Weather("PHOTON");
  ```

- Explicit Initialization, defaults "data" to 25ms intervals
  ```js
  var weather = new Weather({
    variant: "ARDUINO",
    freq: 200
  });

  ...or...
  
  var weather = new Weather({
    variant: "PHOTON",
    freq: 200
  });
  ```

- Explicit Initialization, specify "data" to 200ms intervals
  ```js
  var weather = new Weather({
    variant: "ARDUINO",
    freq: 200
  });

  ...or...

  var weather = new Weather({
    variant: "PHOTON",
    freq: 200
  });
  ```




#### Parameters

| Property   | Type      | Value(s)/Description      | Default | Required |
|------------|-----------|---------------------------|---------|----------|
| variant    | string    | ARDUINO, PHOTON           |         | yes      |
| elevation  | number    | Meters, as reported from whatismyelevation.com (or similar)           |         | yes \*      |
| freq       | number    | Milliseconds. The rate in milliseconds to emit the data event |    25ms     | no      |


\* If `elevation` is omitted, the value of the `feet` and `meters` properties will be `null`. When `elevation` is included, there is a 3 second calibration window before all values are reported.


#### Using the Arduino shield

(Without a specified `elevation`)

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
    console.log("celsius: %d°C", this.celsius);
    console.log("fahrenheit: %d°F", this.fahrenheit);
    console.log("kelvin: %d°K", this.kelvin);
    console.log("pressure: %d kPa", this.pressure);
    console.log("relativeHumidity: %d RH", this.relativeHumidity);
    console.log("lightLevel: %d%", this.lightLevel);
    console.log("----------------------------------------");
  });
});
```

(With a specified `elevation`)

```js
var five = require("johnny-five");
var Weather = require("j5-sparkfun-weather-shield")(five);
var board = new five.Board();

board.on("ready", function() {
  var weather = new Weather({
    variant: "ARDUINO",
    freq: 200, 
    // Input meters from whatismyelevation.com
    elevation: 12 
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
```



#### Using the Photon shield

(Without a specified `elevation`)

```js
var Particle = require("particle-io");
var five = require("johnny-five");
var Weather = require("j5-sparkfun-weather-shield")(five);
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
    console.log("relativeHumidity: %d RH", this.relativeHumidity);
    console.log("----------------------------------------");
  });
});
```

(With a specified `elevation`)

```js
var Particle = require("particle-io");
var five = require("johnny-five");
var Weather = require("j5-sparkfun-weather-shield")(five);
var board = new five.Board({
  io: new Particle({
    token: process.env.PARTICLE_TOKEN,
    deviceId: process.env.PARTICLE_PHOTON_DEVICE
  })
});

board.on("ready", function() {
  var weather = new Weather({
    variant: "PHOTON",
    freq: 200,
    // Input meters from whatismyelevation.com
    elevation: 12     
  });

  weather.on("data", function() {
    console.log("celsius: %d°C", this.celsius);
    console.log("fahrenheit: %d°F", this.fahrenheit);
    console.log("kelvin: %d°K", this.kelvin);
    console.log("pressure: %d kPa", this.pressure);
    console.log("feet: %d\"", this.feet);
    console.log("meters: %d", this.meters);
    console.log("relativeHumidity: %d RH", this.relativeHumidity);
    console.log("----------------------------------------");
  });
});
```


#### Convenient serialization for data tracking: 

```js
var weather = new Weather({
  variant: ...
});

weather.on("data", function() {
  console.log(JSON.stringify(this, null, 2));
});
```

Produces: 

```
{
  "celsius": 24,
  "fahrenheit": 75.2,
  "kelvin": 297.15,
  "pressure": 125.5,
  "feet": 3.28,
  "meters": 1,
  "relativeHumidity": 48,
  "lightLevel": 50
}
```

> Since the Photon shield **does not** include the `ALS-PT19` light sensor, the `lightLevel` property will _always_ be `null` for that variant.


## NOTE

The examples shown here are provided for illustration and do no specifically indicate variant  support. This component class is expected to work with any variant  that has I2C support. 

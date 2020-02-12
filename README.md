# SparkFun Weather Shield


[![Build Status](https://travis-ci.org/rwaldron/j5-sparkfun-weather-shield.svg?branch=master)](https://travis-ci.org/rwaldron/j5-sparkfun-weather-shield)

For use with [Johnny-Five](https://github.com/rwaldron/johnny-five).


- [SparkFun Weather Shield](https://www.sparkfun.com/products/12081) `DEV-12081`, `12081` (Retired)
  + Humidity/Temperature Sensor - HTU21D
  + Barometric Pressure - MPL3115A2
  + Light Sensor - ALS-PT19
  ![](https://cdn.sparkfun.com//assets/parts/8/7/0/7/12081-04.jpg)

- [SparkFun Weather Shield](https://www.sparkfun.com/products/13956) `DEV-13956`, `13956` (Current)
  + Humidity/Temperature Sensor - HTU21D
  + Barometric Pressure - MPL3115A2
  + Light Sensor - ALS-PT19
  ![](https://cdn.sparkfun.com//assets/parts/1/1/6/6/5/13956-04.jpg)
  
- [SparkFun Photon Weather Shield](https://www.sparkfun.com/products/13674) `DEV-13674`, `13674` (Current)
  + Humidity/Temperature Sensor - HTU21D
  + Barometric Pressure - MPL3115A2
  ![](https://cdn.sparkfun.com//assets/parts/1/1/1/2/1/13674-05.jpg)

## API & Documentation

For use with Particle Photon: 

```
npm install johnny-five particle-io j5-sparkfun-weather-shield
```

For use with Arduino: 

```
npm install johnny-five j5-sparkfun-weather-shield
```


### Weather 

The `Weather` class constructs objects that represent the built-in components of the shield.

- Explicit Initialization, defaults "data" to 25ms intervals
  ```js
  const weather = new Weather({
    variant: "ARDUINO",
  });

  ...or...
  
  const weather = new Weather({
    variant: "PHOTON",
  });
  ```

- Explicit Initialization, specify "data" to 200ms intervals
  ```js
  const weather = new Weather({
    variant: "ARDUINO",
    period: 200
  });

  ...or...

  const weather = new Weather({
    variant: "PHOTON",
    period: 200
  });
  ```



#### Parameters

| Property   | Type      | Value(s)/Description      | Default | Required |
|------------|-----------|---------------------------|---------|----------|
| variant    | string    | ARDUINO, PHOTON           |         | yes      |
| elevation  | number    | Meters, as reported from whatismyelevation.com (or similar)           |         | yes \*      |
| period       | number    | Milliseconds. The rate in milliseconds to emit the data event |    25ms     | no      |


\* If `elevation` is omitted, the value of the `feet` and `meters` properties will be `null`. When `elevation` is included, there is a 3 second calibration window before all values are reported.


#### Using the Arduino shield

(Without a specified `elevation`)

```js
const five = require("johnny-five");
const Weather = require("j5-sparkfun-weather-shield")(five);
const board = new five.Board();

board.on("ready", () => {
  const weather = new Weather({
    variant: "ARDUINO",
    period: 200
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
```

(With a specified `elevation`)

```js
const five = require("johnny-five");
const Weather = require("j5-sparkfun-weather-shield")(five);
const board = new five.Board();

board.on("ready", () => {
  const weather = new Weather({
    variant: "ARDUINO",
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
```



#### Using the Photon shield

(Without a specified `elevation`)

```js
const Particle = require("particle-io");
const five = require("johnny-five");
const Weather = require("j5-sparkfun-weather-shield")(five);
const board = new five.Board({
  io: new Particle({
    token: process.env.PARTICLE_TOKEN,
    deviceId: process.env.PARTICLE_PHOTON_1
  })
});

board.on("ready", function() {
  var weather = new Weather({
    variant: "PHOTON",
    period: 200
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
```

(With a specified `elevation`)

```js
const Particle = require("particle-io");
const five = require("johnny-five");
const Weather = require("j5-sparkfun-weather-shield")(five);
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
```


#### Convenient serialization for data payloads: 

```js
const weather = new Weather({
  variant: ...
});

weather.on("data", () => {
  console.log(JSON.stringify(weather, null, 2));
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

The examples shown here are provided for illustration and do no specifically indicate variant  support. This component class is expected to work with any variant that has I2C support. 

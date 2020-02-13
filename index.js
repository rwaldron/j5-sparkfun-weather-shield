const {
  stripIndent
} = require("common-tags");
const Emitter = require("events");

const ALSPT19 = "ALSPT19";
const HTU21D = "HTU21D";
const MPL3115A2 = "MPL3115A2";
const SI7021 = "SI7021";

const variants = {
  // Arduino
  13956: [MPL3115A2, SI7021, ALSPT19],
  13674: [MPL3115A2, HTU21D, ALSPT19],
  // Photon
  13630: [MPL3115A2, SI7021],
  12081: [MPL3115A2, HTU21D],
};

const normalizeVariant = input => typeof input === "number" ?
  input : parseInt(input.replace(/\D+/g, ""), 10);
const average = values => (values.reduce((a, b) => a + b) / values.length);
const enumerable = true;

module.exports = function(five) {

  class Weather extends Emitter {
    constructor(options) {
      super();

      if (typeof options === "string") {
        let variant = options;
        options = {
          variant,
          period: 25,
        };
      }

      const variant = normalizeVariant(options.variant);

      if (options.variant === undefined || !variant) {
        throw new Error(
          stripIndent `
          Missing valid variant.
          Check the 'Variants' section of the README for more information
          `
        );
      }

      if (options.variant === "ARDUINO" ||
        options.variant === "PHOTON") {
        throw new Error(
          stripIndent `
          Invalid variant.
          Variants 'ARDUINO' and 'PHOTON' are not supported in this version.
          Check the 'Variants' section of the README for more information
          `
        );
      }

      if (typeof options.freq !== "undefined") {
        console.warn("The option 'freq' will not be supported in a future version of this plugin. Please use 'period' instead.");
      }

      const [
        barometer,
        thermometer,
        luxometer
      ] = variants[variant];
      const hasElevation = typeof options.elevation !== "undefined";
      const elevation = hasElevation ? {
        elevation: options.elevation
      } : {};
      const period = options.freq || options.period || 25;

      const A = barometer ?
        new five.Multi(
          Object.assign({
            controller: barometer
          }, elevation)
        ) : null;

      const B = thermometer ?
        new five.Multi({
          controller: thermometer
        }) : null;

      const C = luxometer ?
        new five.Light({
          controller: luxometer,
          pin: "A1",
        }) : null;

      const isCalibrated = () => {
        if (!Number(A.barometer.pressure)) {
          return false;
        }
        return true;
      };

      const emitBoundData = event => {
        if (isCalibrated()) {
          this.emit(event, Object.assign({}, this.toJSON()));
        }
      };

      [A, B, C].forEach(sensor => {
        if (sensor) {
          sensor.on("change", () => emitBoundData("change"));
        }
      });

      setInterval(() => emitBoundData("data"), period);

      Object.defineProperties(this, {
        isCalibrated: {
          get() {
            return isCalibrated();
          }
        },
        celsius: {
          enumerable,
          get() {
            return average([
              A.thermometer.celsius,
              B.thermometer.celsius
            ]) >>> 0;
          }
        },
        fahrenheit: {
          enumerable,
          get() {
            return average([
              A.thermometer.fahrenheit,
              B.thermometer.fahrenheit
            ]) >>> 0;
          }
        },
        kelvin: {
          enumerable,
          get() {
            return average([
              A.thermometer.kelvin,
              B.thermometer.kelvin
            ]);
          }
        },
        pressure: {
          enumerable,
          get() {
            return A.barometer.pressure;
          }
        },
        feet: {
          enumerable,
          get() {
            return hasElevation ? A.altimeter.feet : null;
          }
        },
        meters: {
          enumerable,
          get() {
            return hasElevation ? A.altimeter.meters : null;
          }
        },
        relativeHumidity: {
          enumerable,
          get() {
            return B.hygrometer.relativeHumidity;
          }
        },
        lightLevel: {
          enumerable,
          get() {
            return C ? C.level : null;
          }
        },
        toJSON: {
          configurable: true,
          value() {
            const {
              celsius,
              fahrenheit,
              kelvin,
              pressure,
              feet,
              meters,
              relativeHumidity,
              lightLevel
            } = this;
            return {
              celsius,
              fahrenheit,
              kelvin,
              pressure,
              feet,
              meters,
              relativeHumidity,
              lightLevel
            };
          }
        }
      });
    }
  }

  if (global.IS_TEST_MODE) {
    Weather.normalizeVariant = normalizeVariant;
  }

  return Weather;
};

/**
 *  To use the plugin in a program:
 *
 *  var five = require("johnny-five");
 *  var Component = require("component")(five);
 *
 *
 */

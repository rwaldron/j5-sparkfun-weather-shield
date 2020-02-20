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
const enumerable = true;

module.exports = function(five) {
  const average = v => five.Fn.toFixed(v.reduce((a, b) => a + b) / v.length, 2);
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

      const B = barometer ?
        new five.Multi(
          Object.assign({
            controller: barometer
          }, elevation)
        ) : null;

      const T = thermometer ?
        new five.Multi({
          controller: thermometer
        }) : null;

      const L = luxometer ?
        new five.Light({
          controller: luxometer,
          pin: "A1",
        }) : null;

      const isCalibrated = () => {
        if (!Number(B.barometer.pressure)) {
          return false;
        }
        return true;
      };

      const emitBoundData = event => {
        if (isCalibrated()) {
          this.emit(event, Object.assign({}, this.toJSON()));
        }
      };

      [B, T, L].forEach(sensor => {
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
        sensors: {
          get() {
            return {
              [barometer]: B,
              [thermometer]: T,
              ...(luxometer ? {
                [luxometer]: L
              } : {})
            };
          }
        },
        celsius: {
          enumerable,
          get() {
            return average([
              B.thermometer.celsius,
              T.thermometer.celsius
            ]);
          }
        },
        fahrenheit: {
          enumerable,
          get() {
            return average([
              B.thermometer.fahrenheit,
              T.thermometer.fahrenheit
            ]);
          }
        },
        kelvin: {
          enumerable,
          get() {
            return average([
              B.thermometer.kelvin,
              T.thermometer.kelvin
            ]);
          }
        },
        pressure: {
          enumerable,
          get() {
            return B.barometer.pressure;
          }
        },
        feet: {
          enumerable,
          get() {
            return hasElevation ? B.altimeter.feet : null;
          }
        },
        meters: {
          enumerable,
          get() {
            return hasElevation ? B.altimeter.meters : null;
          }
        },
        relativeHumidity: {
          enumerable,
          get() {
            return T.hygrometer.relativeHumidity;
          }
        },
        lightLevel: {
          enumerable,
          get() {
            return L ? L.level : null;
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
    Weather.SENSORS = {
      ALSPT19,
      HTU21D,
      MPL3115A2,
      SI7021,
    };
    Weather.VARIANTS = variants;
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

var Emitter = require("events").EventEmitter;
var util = require("util");

function average(values) {
  return values.reduce(function(a, b) {
    return a + b;
  }) / values.length;
}

module.exports = function(five) {
  return (function() {

    function Component(opts) {
      if (!(this instanceof Component)) {
        return new Component(opts);
      }

      var ALSPT19;
      var variant;
      var hasElevation = false;
      var mplOpts = {
        controller: "MPL3115A2",
      };

      if (typeof opts === "string") {
        variant = opts;
        opts = {
          variant: variant,
          freq: 25,
        };
      }

      if (typeof opts.elevation !== "undefined") {
        mplOpts.elevation = opts.elevation;
        hasElevation = true;
      }

      if (opts.variant === undefined) {
        throw new Error("Missing variant");
      }

      if (opts.variant === "ARDUINO") {
        ALSPT19 = new five.Light({
          controller: "ALSPT19",
          pin: "A1",
        });
      }

      var HTU21D = new five.Multi({
        controller: "HTU21D"
      });

      var MPL3115A2 = new five.Multi(mplOpts);

      function isCalibrated() {
        if (!Number(MPL3115A2.barometer.pressure)) {
          return false;
        }
        return true;
      }

      var freq = opts.freq || 25;
      var emit = this.emit.bind(this);
      var emitBoundData = function(event) {
        if (isCalibrated()) {
          emit(event, Object.assign({}, this.toJSON()));
        }
      }.bind(this);

      [MPL3115A2, HTU21D, ALSPT19].forEach(function(sensor) {
        if (sensor) {
          sensor.on("change", function() {
            emitBoundData("change");
          }.bind(this));
        }
      }, this);

      setInterval(function() {
        emitBoundData("data");
      }, freq);

      Object.defineProperties(this, {
        isCalibrated: {
          get: function() {
            return isCalibrated();
          }
        },
        celsius: {
          enumerable: true,
          get: function() {
            return average([
              MPL3115A2.temperature.celsius,
              HTU21D.temperature.celsius
            ]);
          }
        },
        fahrenheit: {
          enumerable: true,
          get: function() {
            return average([
              MPL3115A2.temperature.fahrenheit,
              HTU21D.temperature.fahrenheit
            ]);
          }
        },
        kelvin: {
          enumerable: true,
          get: function() {
            return average([
              MPL3115A2.temperature.kelvin,
              HTU21D.temperature.kelvin
            ]);
          }
        },
        pressure: {
          enumerable: true,
          get: function() {
            return MPL3115A2.barometer.pressure;
          }
        },
        feet: {
          enumerable: true,
          get: function() {
            return hasElevation ? MPL3115A2.altimeter.feet : null;
          }
        },
        meters: {
          enumerable: true,
          get: function() {
            return hasElevation ? MPL3115A2.altimeter.meters : null;
          }
        },
        relativeHumidity: {
          enumerable: true,
          get: function() {
            return HTU21D.hygrometer.relativeHumidity;
          }
        },
        lightLevel: {
          enumerable: true,
          get: function() {
            return ALSPT19 ? ALSPT19.level : null;
          }
        },
        toJSON: {
          configurable: true,
          value: function() {
            var data = Object.assign({}, this);
            delete data._events;
            return data;
          }
        }
      });
    }

    util.inherits(Component, Emitter);

    return Component;
  }());
};


/**
 *  To use the plugin in a program:
 *
 *  var five = require("johnny-five");
 *  var Component = require("component")(five);
 *
 *
 */

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
      var HTU21D = new five.Multi({
        controller: "HTU21D"
      });
      var MPL3115A2 = new five.Multi({
        controller: "MPL3115A2"
      });
      var variant;

      if (typeof opts === "string") {
        variant = opts;
        opts = {
          variant: variant,
          freq: 25,
        };
      }

      if (opts.variant === undefined) {
        throw new Error("Missing variant");
      }

      if (opts.variant === "ARDUINO") {
        ALSPT19 = new five.Light({
          controller: "ALSPT19"
        });
      }

      var freq = opts.freq || 25;
      var emit = this.emit.bind(this);
      var emitBoundData = function(event) {
        var data = Object.assign({}, this);
        delete data._events;
        emit(event, data);
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
            return MPL3115A2.altimeter.feet;
          }
        },
        meters: {
          enumerable: true,
          get: function() {
            return MPL3115A2.altimeter.meters;
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

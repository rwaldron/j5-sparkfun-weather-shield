var Emitter = require("events").EventEmitter;
var util = require("util");

function average(values) {
  return values.reduce(function(a, b) { return a + b; }) / values.length;
}

module.exports = function(five) {
  return (function() {

    function Component(opts) {
      if (!(this instanceof Component)) {
        return new Component(opts);
      }

      var MPL3115A2 = new five.Multi({ controller: "MPL3115A2" });
      var HTU21D = new five.Multi({ controller: "HTU21D" });
      var ALSPT19;

      if (opts.variant === "ARDUINO") {
        ALSPT19 = new five.Light({
          controller: "ALSPT19"
        });
      }

      var freq = opts.freq || 25;
      var emit = this.emit.bind(this);
      var emitBoundData = function(event) {
        emit(event, Object.assign({}, this));
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
          get: function() {
            return average([
              MPL3115A2.temperature.celsius,
              HTU21D.temperature.celsius
            ]);
          }
        },
        fahrenheit: {
          get: function() {
            return average([
              MPL3115A2.temperature.fahrenheit,
              HTU21D.temperature.fahrenheit
            ]);
          }
        },
        kelvin: {
          get: function() {
            return average([
              MPL3115A2.temperature.kelvin,
              HTU21D.temperature.kelvin
            ]);
          }
        },
        pressure: {
          get: function() {
            return MPL3115A2.barometer.pressure;
          }
        },
        feet: {
          get: function() {
            return MPL3115A2.altimeter.feet;
          }
        },
        meters: {
          get: function() {
            return MPL3115A2.altimeter.meters;
          }
        },
        relativeHumidity: {
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

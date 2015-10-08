require("es6-shim");

var sinon = require("sinon");
var Emitter = require("events").EventEmitter;
var five = require("johnny-five");
var Weather = require("../")(five);

var ownProps = [
  "celsius",
  "fahrenheit",
  "kelvin",
  "pressure",
  "feet",
  "meters",
  "relativeHumidity",
  "lightLevel",
];

exports["Weather"] = {
  setUp: function(done) {
    this.sandbox = sinon.sandbox.create();
    this.clock = this.sandbox.useFakeTimers();
    this.multis = {};
    this.light = null;

    this.Multi = this.sandbox.stub(five, "Multi", function(opts) {
      var multi = new Emitter();

      multi.temperature = {
        celsius: 24,
        fahrenheit: 75.2,
        kelvin: 297.15,
      };

      multi.barometer = {
        pressure: 125.5,
      };

      multi.altimeter = {
        feet: 3.28,
        meters: 1,
      };

      multi.hygrometer = {
        relativeHumidity: 48,
      };

      multi.hygrometer = {
        relativeHumidity: 48,
      };

      this.multis[opts.controller] = multi;

      return multi;
    }.bind(this));

    this.Light = this.sandbox.stub(five, "Light", function() {
      var light = new Emitter();

      light.level = 50;

      this.light = light;
      return light;
    }.bind(this));
    done();
  },

  tearDown: function(done) {
    this.sandbox.restore();
    done();
  },

  initializesArduino: function(test) {
    test.expect(13);

    var weather = new Weather({
      variant: "ARDUINO"
    });

    test.equal(this.Multi.callCount, 2);
    test.equal(this.Light.callCount, 1);

    test.deepEqual(this.Multi.firstCall.args[0], {
      controller: "HTU21D"
    });
    test.deepEqual(this.Multi.lastCall.args[0], {
      controller: "MPL3115A2"
    });
    test.deepEqual(this.Light.lastCall.args[0], {
      controller: "ALSPT19"
    });

    ownProps.forEach(function(own) {
      test.ok(own in weather);
    });

    test.done();
  },

  initializesArduinoShorthand: function(test) {
    test.expect(13);

    var weather = new Weather("ARDUINO");

    test.equal(this.Multi.callCount, 2);
    test.equal(this.Light.callCount, 1);

    test.deepEqual(this.Multi.firstCall.args[0], {
      controller: "HTU21D"
    });
    test.deepEqual(this.Multi.lastCall.args[0], {
      controller: "MPL3115A2"
    });
    test.deepEqual(this.Light.lastCall.args[0], {
      controller: "ALSPT19"
    });

    ownProps.forEach(function(own) {
      test.ok(own in weather);
    });

    test.done();
  },

  initializesPhoton: function(test) {
    test.expect(12);

    var weather = new Weather({
      variant: "PHOTON"
    });

    test.equal(this.Multi.callCount, 2);
    test.equal(this.Light.callCount, 0);

    test.deepEqual(this.Multi.firstCall.args[0], {
      controller: "HTU21D"
    });
    test.deepEqual(this.Multi.lastCall.args[0], {
      controller: "MPL3115A2"
    });

    ownProps.forEach(function(own) {
      test.ok(own in weather);
    });

    test.done();
  },

  initializesPhotonShorthand: function(test) {
    test.expect(12);

    var weather = new Weather("PHOTON");

    test.equal(this.Multi.callCount, 2);
    test.equal(this.Light.callCount, 0);

    test.deepEqual(this.Multi.firstCall.args[0], {
      controller: "HTU21D"
    });
    test.deepEqual(this.Multi.lastCall.args[0], {
      controller: "MPL3115A2"
    });

    ownProps.forEach(function(own) {
      test.ok(own in weather);
    });

    test.done();
  },

  missingVariant: function(test) {
    test.expect(2);

    test.throws(function() {
      new Weather();
    });

    test.throws(function() {
      new Weather({
        freq: 0
      });
    });

    test.done();
  },

  freq: function(test) {
    test.expect(2);

    var spy = this.sandbox.spy();
    var weather = new Weather({
      variant: "ARDUINO",
      freq: 1,
    });

    weather.on("data", spy);

    this.clock.tick(1);

    test.equal(spy.callCount, 1);

    this.clock.tick(10);

    test.equal(spy.callCount, 11);

    test.done();
  },

  data: function(test) {
    test.expect(1);

    var spy = this.sandbox.spy();
    var weather = new Weather({
      variant: "ARDUINO",
    });

    weather.on("data", spy);

    this.clock.tick(25);

    test.equal(spy.callCount, 1);

    test.done();
  },

  change: function(test) {
    test.expect(4);

    var spy = this.sandbox.spy();
    var weather = new Weather({
      variant: "ARDUINO",
    });

    weather.on("change", spy);

    this.multis.MPL3115A2.emit("change");
    this.multis.HTU21D.emit("change");
    this.light.emit("change");

    test.equal(spy.callCount, 3);
    test.deepEqual(spy.getCall(2).args[0], {
      celsius: 24,
      fahrenheit: 75.2,
      kelvin: 297.15,
      pressure: 125.5,
      feet: 3.28,
      meters: 1,
      relativeHumidity: 48,
      lightLevel: 50
    });

    // BOTH have to change, since they are averaged!!
    this.multis.MPL3115A2.temperature.celsius = 0;
    this.multis.HTU21D.temperature.celsius = 10;
    this.multis.HTU21D.hygrometer.relativeHumidity = 0;

    this.multis.MPL3115A2.emit("change");
    this.multis.HTU21D.emit("change");
    this.light.emit("change");

    test.equal(spy.callCount, 6);
    test.deepEqual(spy.lastCall.args[0], {
      celsius: 5,
      fahrenheit: 75.2,
      kelvin: 297.15,
      pressure: 125.5,
      feet: 3.28,
      meters: 1,
      relativeHumidity: 0,
      lightLevel: 50
    });

    test.done();
  },
};

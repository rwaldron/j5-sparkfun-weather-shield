global.IS_TEST_MODE = true;
const sinon = require("sinon");
const Emitter = require("events");
const five = {
  Multi: function() {},
  Light: function() {},
};
const Weather = require("../")(five);

const ownProps = [
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
  setUp(done) {
    this.sandbox = sinon.sandbox.create();
    this.clock = this.sandbox.useFakeTimers();
    this.multis = {};
    this.light = null;

    this.Multi = this.sandbox.stub(five, "Multi", ({
      controller
    }) => {
      const multi = new Emitter();

      multi.thermometer = {
        celsius: 24,
        fahrenheit: 75,
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

      this.multis[controller] = multi;

      return multi;
    });

    this.Light = this.sandbox.stub(five, "Light", () => {
      const light = new Emitter();

      light.level = 50;

      this.light = light;
      return light;
    });
    done();
  },

  tearDown(done) {
    this.sandbox.restore();
    done();
  },

  stopUsingFreq(test) {
    test.expect(2);

    this.warn = this.sandbox.stub(console, "warn");

    new Weather({
      variant: 13956,
      freq: 0
    });

    test.equal(this.warn.callCount, 1);
    test.equal(this.warn.getCall(0).args[0], "The option 'freq' will not be supported in a future version of this plugin. Please use 'period' instead.");
    test.done();
  },

  missingVariant(test) {
    test.expect(2);

    test.throws(() => {
      new Weather();
    });

    test.throws(() => {
      new Weather({
        period: 0
      });
    });

    test.done();
  },

  invalidVariant(test) {
    test.expect(2);

    test.throws(() => {
      new Weather("ARDUINO");
    });

    test.throws(() => {
      new Weather({
        variant: "ARDUINO"
      });
    });

    test.done();
  },

  normalizeVariant(test) {
    test.expect(4);

    test.equal(Weather.normalizeVariant("DEV-13956"), 13956);
    test.equal(Weather.normalizeVariant("DEV13956"), 13956);
    test.equal(Weather.normalizeVariant("13956"), 13956);
    test.equal(Weather.normalizeVariant(13956), 13956);

    test.done();
  },

  DEV13956: {
    initializesArduino(test) {
      test.expect(13);

      const weather = new Weather({
        variant: "DEV-13956"
      });

      test.equal(this.Multi.callCount, 2);
      test.equal(this.Light.callCount, 1);

      test.deepEqual(this.Multi.firstCall.args[0], {
        controller: "MPL3115A2"
      });
      test.deepEqual(this.Multi.lastCall.args[0], {
        controller: "SI7021"
      });
      test.deepEqual(this.Light.lastCall.args[0], {
        controller: "ALSPT19",
        pin: "A1",
      });

      ownProps.forEach(own => {
        test.ok(own in weather);
      });

      test.done();
    },

    initializesArduinoShorthand(test) {
      test.expect(13);

      const weather = new Weather("DEV-13956");

      test.equal(this.Multi.callCount, 2);
      test.equal(this.Light.callCount, 1);

      test.deepEqual(this.Multi.firstCall.args[0], {
        controller: "MPL3115A2"
      });
      test.deepEqual(this.Multi.lastCall.args[0], {
        controller: "SI7021"
      });
      test.deepEqual(this.Light.lastCall.args[0], {
        controller: "ALSPT19",
        pin: "A1",
      });

      ownProps.forEach(own => {
        test.ok(own in weather);
      });

      test.done();
    },
  },

  DEV13674: {
    initializesArduino(test) {
      test.expect(13);

      const weather = new Weather({
        variant: "DEV-13674"
      });

      test.equal(this.Multi.callCount, 2);
      test.equal(this.Light.callCount, 1);

      test.deepEqual(this.Multi.firstCall.args[0], {
        controller: "MPL3115A2"
      });
      test.deepEqual(this.Multi.lastCall.args[0], {
        controller: "HTU21D"
      });
      test.deepEqual(this.Light.lastCall.args[0], {
        controller: "ALSPT19",
        pin: "A1",
      });

      ownProps.forEach(own => {
        test.ok(own in weather);
      });

      test.done();
    },

    initializesArduinoShorthand(test) {
      test.expect(13);

      const weather = new Weather("DEV-13674");

      test.equal(this.Multi.callCount, 2);
      test.equal(this.Light.callCount, 1);

      test.deepEqual(this.Multi.firstCall.args[0], {
        controller: "MPL3115A2"
      });
      test.deepEqual(this.Multi.lastCall.args[0], {
        controller: "HTU21D"
      });
      test.deepEqual(this.Light.lastCall.args[0], {
        controller: "ALSPT19",
        pin: "A1",
      });

      ownProps.forEach(own => {
        test.ok(own in weather);
      });

      test.done();
    },
  },

  DEV13630: {
    initializesPhoton(test) {
      test.expect(12);

      const weather = new Weather({
        variant: "DEV-13630"
      });

      test.equal(this.Multi.callCount, 2);
      test.equal(this.Light.callCount, 0);

      test.deepEqual(this.Multi.firstCall.args[0], {
        controller: "MPL3115A2"
      });
      test.deepEqual(this.Multi.lastCall.args[0], {
        controller: "SI7021"
      });

      ownProps.forEach(own => {
        test.ok(own in weather);
      });

      test.done();
    },

    initializesPhotonShorthand(test) {
      test.expect(12);

      const weather = new Weather("DEV-13630");

      test.equal(this.Multi.callCount, 2);
      test.equal(this.Light.callCount, 0);

      test.deepEqual(this.Multi.firstCall.args[0], {
        controller: "MPL3115A2"
      });
      test.deepEqual(this.Multi.lastCall.args[0], {
        controller: "SI7021"
      });

      ownProps.forEach(own => {
        test.ok(own in weather);
      });

      test.done();
    },
  },

  DEV12081: {
    initializesPhoton(test) {
      test.expect(12);

      const weather = new Weather({
        variant: "DEV-12081"
      });

      test.equal(this.Multi.callCount, 2);
      test.equal(this.Light.callCount, 0);

      test.deepEqual(this.Multi.firstCall.args[0], {
        controller: "MPL3115A2"
      });
      test.deepEqual(this.Multi.lastCall.args[0], {
        controller: "HTU21D"
      });

      ownProps.forEach(own => {
        test.ok(own in weather);
      });

      test.done();
    },

    initializesPhotonShorthand(test) {
      test.expect(12);

      const weather = new Weather("DEV-12081");

      test.equal(this.Multi.callCount, 2);
      test.equal(this.Light.callCount, 0);

      test.deepEqual(this.Multi.firstCall.args[0], {
        controller: "MPL3115A2"
      });
      test.deepEqual(this.Multi.lastCall.args[0], {
        controller: "HTU21D"
      });

      ownProps.forEach(own => {
        test.ok(own in weather);
      });

      test.done();
    },
  },

  period(test) {
    test.expect(2);

    const spy = this.sandbox.spy();
    const weather = new Weather({
      variant: "DEV-13956",
      period: 1,
    });

    weather.on("data", spy);

    this.clock.tick(1);

    test.equal(spy.callCount, 1);

    this.clock.tick(10);

    test.equal(spy.callCount, 11);

    test.done();
  },

  data(test) {
    test.expect(1);

    const spy = this.sandbox.spy();
    const weather = new Weather({
      variant: "DEV-13956",
    });

    weather.on("data", spy);

    this.clock.tick(25);

    test.equal(spy.callCount, 1);

    test.done();
  },

  change(test) {
    test.expect(4);

    const spy = this.sandbox.spy();
    const weather = new Weather({
      variant: "DEV-13956",
      elevation: 1,
    });

    weather.on("change", spy);
    this.multis.MPL3115A2.emit("change");
    this.multis.SI7021.emit("change");
    this.light.emit("change");

    test.equal(spy.callCount, 3);
    test.deepEqual(spy.getCall(2).args[0], {
      celsius: 24,
      fahrenheit: 75,
      kelvin: 297.15,
      pressure: 125.5,
      feet: 3.28,
      meters: 1,
      relativeHumidity: 48,
      lightLevel: 50
    });

    // BOTH have to change, since they are averaged!!
    this.multis.MPL3115A2.thermometer.celsius = 0;
    this.multis.SI7021.thermometer.celsius = 10;
    this.multis.SI7021.hygrometer.relativeHumidity = 0;

    this.multis.MPL3115A2.emit("change");
    this.multis.SI7021.emit("change");
    this.light.emit("change");

    test.equal(spy.callCount, 6);
    test.deepEqual(spy.lastCall.args[0], {
      celsius: 5,
      fahrenheit: 75,
      kelvin: 297.15,
      pressure: 125.5,
      feet: 3.28,
      meters: 1,
      relativeHumidity: 0,
      lightLevel: 50
    });

    test.done();
  },

  toJSON(test) {
    test.expect(1);

    const weather = new Weather({
      variant: "DEV-13956",
    });

    const spy = this.sandbox.spy(weather, "toJSON");

    JSON.stringify(weather);

    test.equal(spy.callCount, 1);

    test.done();
  },

  serialization(test) {
    test.expect(2);

    const spy = this.sandbox.spy();
    const weather = new Weather({
      variant: "DEV-13956",
    });

    weather.on("data", spy);

    this.clock.tick(25);

    test.deepEqual(spy.lastCall.args[0], weather.toJSON());
    test.deepEqual(JSON.stringify(weather), JSON.stringify(weather.toJSON()));

    test.done();
  },
};

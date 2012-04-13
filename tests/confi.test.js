var confi = require('../');

exports.testDefault = function(t) {
  confi.reset();
  var config = confi.load({ env: 'default' });
  t.equal(config.host, 'localhost');
  t.equal(config.analytics.enabled, true);
  t.equal(config.analytics.profile, 'ga-xxx');
  t.done();
};

exports.testDev = function(t) {
  confi.reset();
  var config = confi.load();
  t.equal(config.host, 'localhost');
  t.equal(config.apikey, 'asdfasdf');
  t.equal(config.analytics.enabled, false);
  t.equal(config.analytics.profile, 'ga-xxx');
  t.done();
};

exports.testProd = function(t) {
  confi.reset();
  var config = confi.load({ env: "production"});
  t.equal(config.analytics.enabled, true);
  t.equal(config.analytics.profile, 'ga-xxx');
  t.equal(config.host, 'prod');
  t.done();
};

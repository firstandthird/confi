var confi = require('../');

exports.testDefault = function(t) {
  confi.reset();
  var config = confi.load();
  t.equal(config.host, 'localhost');
  t.done();
};

exports.testDev = function(t) {
  confi.reset();
  var config = confi.load();
  t.equal(config.host, 'localhost');
  t.equal(config.apikey, 'asdfasdf');
  t.done();
};

exports.testProd = function(t) {
  confi.reset();
  var config = confi.load({ env: "production"});
  t.equal(config.host, 'prod');
  t.done();
};

var confy = require('../');

exports.testDefault = function(t) {
  var config = confy.load();
  t.equal(config.host, 'localhost');
  t.done();
};

exports.testDev = function(t) {
  var config = confy.load();
  t.equal(config.host, 'localhost');
  t.equal(config.apikey, 'asdfasdf');
  t.done();
};


exports.testProd = function(t) {
  var config = confy.load({ env: "production"});
  t.equal(config.host, 'prod');
  t.done();
};

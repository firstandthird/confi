var confi = require('../');

exports.testDefault = function(t) {
  confi.reset();
  var config = confi.load({ env: 'default' });
  t.equal(config.host, 'localhost');
  t.equal(config.analytics.enabled, true);
  t.equal(config.analytics.profile, 'ga-xxx');
  t.equal(config.env, 'default');
  t.done();
};

exports.testDev = function(t) {
  confi.reset();
  var config = confi.load();
  t.equal(config.host, 'localhost');
  t.equal(config.apikey, 'asdfasdf');
  t.equal(config.analytics.enabled, false);
  t.equal(config.analytics.profile, 'ga-xxx');
  t.equal(config.isTest, true);
  t.equal(config.env, 'dev');
  t.done();
};

exports.testProd = function(t) {
  confi.reset();
  var config = confi.load({ env: "production"});
  t.equal(config.analytics.enabled, true);
  t.equal(config.analytics.profile, 'ga-xxx');
  t.equal(config.host, 'prod');
  t.equal(config.env, 'production');
  t.done();
};

exports.testUser = function(t) {
  console.log('This test won\'t pass unless your username is jga :/');
  confi.reset();
  var config = confi.load({
    env: 'dev',
    userConfig: true
  });
  t.equal(config.analytics.enabled, true);
  t.done();
};

exports.testUserWithPath = function(t) {
  console.log('This test won\'t pass unless your username is jga :/');
  confi.reset();
  var config = confi.load({
    env: 'dev',
    userConfig: __dirname + '/conf/users'
  });
  t.equal(config.analytics.enabled, true);
  t.done();
};

exports.testYAML = function(t) {
  confi.reset();
  var config = confi.load({
    env: 'yaml'
  });

  t.equal(config.analytics.enabled, false);
  t.equal(config.yaml, true);
  t.done();

};

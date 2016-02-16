/*global describe, it*/
var chai = require('chai');
var assert = chai.assert;
var confi = require('../');

describe('confi', function() {
  it('can open the default file ', function(done) {
    var config = confi({ env: 'default' });
    assert.equal(config.host, 'localhost');
    assert.equal(config.analytics.enabled, true);
    assert.equal(config.analytics.profile, 'ga-xxx');
    assert.equal(config.env, 'default');
    done();
  });
  it('can open multiple paths', function(done) {
    var config = confi({ env: 'default', path: ['./conf', './conf2'] });
    assert.equal(config.host, 'localhost');
    assert.equal(config.env, 'default');
    assert.equal(config.multiple, true);
    done();
  });
  it('can open the dev env', function(done) {
    process.env.testEnv = 'test';
    var config = confi();
    assert.equal(config.host, 'localhost');
    assert.equal(config.apikey, 'asdfasdf');
    assert.equal(config.analytics.enabled, false);
    assert.equal(config.analytics.profile, 'ga-xxx');
    assert.equal(config.isTest, true);
    assert.equal(config.testHost, 'localhost/test/path');
    assert.equal(config.ENV.testEnv, 'test');
    assert.equal(config.testDefault, '123456');
    assert.equal(config.testDefault2, 'localhost');
    assert.equal(config.testDefault3, '123456');
    assert.equal(config.env, 'dev');
    done();
  });
  it('can open the production env', function(done) {
    var config = confi({ env: 'production' });
    assert.equal(config.analytics.enabled, true);
    assert.equal(config.analytics.profile, 'ga-xxx');
    assert.equal(config.host, 'prod');
    assert.equal(config.env, 'production');
    done();
  });
  it('can open yaml files', function(done) {
    var config = confi({ env: 'default' });
    assert.equal(config.yaml, true);
    done();
  });
  it('can open json files', function(done) {
    var config = confi({ env: 'default' });
    assert.equal(config.json, true);
    done();
  });
  it('opens files with the environment prefix (eg default-plugin.json, default-route.yaml))', function(done) {
    var config = confi({ env: 'default' });
    assert.equal(config.auth, true);
    assert.equal(config.plugin, true);
    assert.equal(config.blah, true);
    done();
  });

  it('pulls in user config on top of default and env', function(done) {
    var config = confi({ env: 'dev', user: 'jga' });
    assert.equal(config.apikey, 'jga-key');
    done();
  });

  it('should pass in context', function(done) {
    var config = confi({
      env: 'context',
      context: {
        random: function() {
          return Math.random();
        }
      }
    });
    assert.equal(typeof config.context.random, 'number');
    done();
  });
});

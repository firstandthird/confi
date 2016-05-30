'use strict';
/*global describe, it*/
const chai = require('chai');
const assert = chai.assert;
const confi = require('../');

describe('confi', () => {
  it('can open the default file ', (done) => {
    const config = confi({ env: 'default' });
    assert.equal(config.host, 'localhost');
    assert.equal(config.analytics.enabled, true);
    assert.equal(config.analytics.profile, 'ga-xxx');
    assert.equal(config.env, 'default');
    done();
  });
  it('can open multiple paths', (done) => {
    const config = confi({ env: 'default', path: ['./conf', './conf2'] });
    assert.equal(config.host, 'localhost');
    assert.equal(config.env, 'default');
    assert.equal(config.multiple, true);
    done();
  });
  it('can open the dev env', (done) => {
    process.env.testEnv = 'test';
    const config = confi();
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
  it('can open the production env', (done) => {
    const config = confi({ env: 'production' });
    assert.equal(config.analytics.enabled, true);
    assert.equal(config.analytics.profile, 'ga-xxx');
    assert.equal(config.host, 'prod');
    assert.equal(config.env, 'production');
    done();
  });
  it('can open yaml files', (done) => {
    const config = confi({ env: 'default' });
    assert.equal(config.yaml, true);
    done();
  });
  it('can open json files', (done) => {
    const config = confi({ env: 'default' });
    assert.equal(config.json, true);
    done();
  });
  it('opens files with the environment prefix (eg default-plugin.json, default-route.yaml))', (done) => {
    const config = confi({ env: 'default' });
    assert.equal(config.auth, true);
    assert.equal(config.plugin, true);
    assert.equal(config.blah, true);
    done();
  });

  it('pulls in user config on top of default and env', (done) => {
    const config = confi({ env: 'dev', user: 'jga' });
    assert.equal(config.apikey, 'jga-key');
    done();
  });

  it('should allow additional context to be passed directly into confi', (done) => {
    const config = confi({
      context: {
        customData: true
      }
    });
    assert.equal(config.customData, true);
    done();
  });


  it('should support helper functions', (done) => {
    const config = confi({
      env: 'context',
      helpers: {
        getRandomNumber: () => Math.random()
      }
    });
    assert.equal(typeof config.context.random, 'number');
    //make sure it doesn't get added to data
    assert.equal(typeof config.getRandomNumber, 'undefined');
    done();
  });
  it('throws an error if any files fail to parse', (done) => {
    try {
      const config = confi({ env: 'default', path: ['./dysfunctional'] });
      // if we ever reach this line then something didn't work:
      assert.equal(config, false);
    } catch (exc) {
      assert.equal(exc.message, 'Unable to parse file default.yaml')
    }
    done();
  });
});

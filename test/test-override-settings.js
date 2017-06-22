'use strict';
/*global describe, it*/
const tape = require('tap').test;
tape.skip = () => {};
const confi = require('../');
const path = require('path');

tape('can open the default file ', (assert) => {
  confi({ env: 'default' }, (err, config) => {
    assert.equal(err, null);
    assert.equal(config.host, 'localhost');
    assert.equal(config.analytics.enabled, true);
    assert.equal(config.analytics.profile, 'ga-xxx');
    assert.equal(config.env, undefined);
    assert.end();
  });
});

tape('can open a specified config file ', (assert) => {
  confi({
    configFile: path.join(__dirname, 'conf3', 'useit-prod.yaml')
  }, (err, config) => {
    assert.equal(err, null);
    assert.equal(config.prod, true, 'opens the specified config file');
    assert.equal(config.host, 'localhost', 'opens the default env along with configFile');
    assert.end();
  });
});

tape('can skip opening a path', (assert) => {
  confi({ path: false }, (err, config) => {
    assert.equal(err, null);
    assert.equal(config.host, undefined, 'does not open the path ');
    assert.end();
  });
});

tape('can open multiple paths', (assert) => {
  confi({ env: 'default', path: ['./conf', './conf2'] }, (err, config) => {
    assert.equal(config.host, 'localhost');
    assert.equal(config.env, undefined);
    assert.equal(config.multiple, true);
    assert.end();
  });
});

tape('can open the dev env', (assert) => {
  process.env.testEnv = 'test';
  confi((err, config) => {
    assert.equal(config.host, 'localhost');
    assert.equal(config.apikey, 'asdfasdf');
    assert.equal(config.analytics.enabled, false);
    assert.equal(config.analytics.profile, 'ga-xxx');
    assert.equal(config.isTest, true);
    assert.equal(config.testHost, 'localhost/test/path');
    assert.equal(config.testDefault, 123456);
    assert.equal(config.testDefault2, 'localhost');
    assert.equal(config.testDefault3, 123456);
    assert.equal(config.ENV, undefined);
    assert.equal(config.env, undefined);
    assert.end();
  });
});

tape('can open the production env', (assert) => {
  confi({ env: 'production' }, (err, config) => {
    assert.equal(config.analytics.enabled, true);
    assert.equal(config.analytics.profile, 'ga-xxx');
    assert.equal(config.host, 'prod');
    assert.equal(config.env, undefined);
    assert.end();
  });
});

tape('can open yaml files', (assert) => {
  confi({ env: 'default' }, (err, config) => {
    assert.equal(config.yaml, true);
    assert.end();
  });
});
tape('can open json files', (assert) => {
  confi({ env: 'default' }, (err, config) => {
    assert.equal(config.json, true);
    assert.end();
  });
});
tape('opens files with the environment prefix (eg default-plugin.json, default-route.yaml))', (assert) => {
  confi({ env: 'default' }, (err, config) => {
    assert.equal(config.auth, true);
    assert.equal(config.plugin, true);
    assert.equal(config.blah, true);
    assert.end();
  });
});

tape('pulls in user config on top of default and env', (assert) => {
  confi({ env: 'dev', user: 'jga' }, (err, config) => {
    assert.equal(config.apikey, 'jga-key');
    assert.end();
  });
});

tape('should allow additional context to be passed directly into confi', (assert) => {
  const config = confi({
    context: {
      customData: true
    }
  }, (err, config) => {
    assert.equal(config.customData, true);
    assert.end();
  });
});

tape('should support helper functions', (assert) => {
  confi({
    env: 'context',
    helpers: {
      getRandomNumber: () => Math.random()
    }
  }, (err, config) => {
    assert.equal(typeof config.context.random, 'number');
    //make sure it doesn't get added to data
    assert.equal(typeof config.getRandomNumber, 'undefined');
    assert.end();
  });
});

//unsupported right now
tape.skip('should support helper functions that return functions', (assert) => {
  confi({
    env: 'function-helper',
    helpers: {
      getFunction: value => function() { return value; }
    }
  }, (err, config) => {
    assert.equal(typeof config.context.fn, 'function');
    assert.equal(config.context.fn(), 'some value');
    assert.end();
  });
});

tape('callback returns an error if any files fail to parse', (assert) => {
  confi({ env: 'default', path: ['./dysfunctional'] }, (err, config) => {
    assert.notEqual(err, null);
    assert.end();
  });
});

tape('should be able to load env vars with a specific prefix with the envVars: <prefix> option', (assert) => {
  process.env.CONFI_SUBDOC__SUBSUB_DOC1 = 'the first part';
  process.env.CONFI_SUBDOC__SUBSUB_DOC2 = 'the second part';
  confi({ envVars: 'CONFI' }, (err, config) => {
    assert.equal(config.subdoc.subsubDoc1, 'the first part');
    assert.equal(config.subdoc.subsubDoc2, 'the second part');
    assert.end();
  });
});

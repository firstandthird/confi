'use strict';
/*global describe, it*/
const tape = require('tap').test;
tape.skip = () => {};
const confi = require('../');
const path = require('path');

tape('can open the default file ', async(assert) => {
  const config = await confi({ env: 'default', path: ['./test/conf'] });
  assert.equal(config.host, 'localhost');
  assert.equal(config.analytics.enabled, true);
  assert.equal(config.analytics.profile, 'ga-xxx');
  assert.equal(config.env, 'default');
  assert.end();
});

tape('can open a specified config file ', async(assert) => {
  const config = await confi({
    path: ['./test/conf'],
    configFile: path.join(__dirname, 'conf3', 'useit-prod.yaml')
  });
  assert.equal(config.prod, true, 'opens the specified config file');
  assert.equal(config.host, 'localhost', 'opens the default env along with configFile');
  assert.end();
});

tape('can skip opening a path', async(assert) => {
  const config = await confi({ path: false });
  assert.equal(config.host, undefined, 'does not open the path ');
  assert.end();
});

tape('can open multiple paths', async(assert) => {
  const config = await confi({ env: 'default', path: ['./test/conf', './test/conf2'] });
  assert.equal(config.host, 'localhost');
  assert.equal(config.env, 'default');
  assert.equal(config.multiple, true);
  assert.end();
});

tape('can open the dev env', async(assert) => {
  process.env.testEnv = 'test';
  const config = await confi({ path: './test/conf' });
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
  assert.equal(config.env, 'dev');
  assert.end();
});

tape('can open the production env', async(assert) => {
  const config = await confi({ env: 'production', path: './test/conf' });
  assert.equal(config.analytics.enabled, true);
  assert.equal(config.analytics.profile, 'ga-xxx');
  assert.equal(config.host, 'prod');
  assert.equal(config.env, 'production');
  assert.end();
});

tape('can open yaml files', async(assert) => {
  const config = await confi({ env: 'default', path: './test/conf' });
  assert.equal(config.yaml, true);
  assert.end();
});

tape('can open json files', async(assert) => {
  const config = await confi({ env: 'default', path: './test/conf' });
  assert.equal(config.json, true);
  assert.end();
});

tape('opens files with the environment prefix (eg default-plugin.json, default-route.yaml))', async(assert) => {
  const config = await confi({ env: 'default', path: './test/conf' });
  assert.equal(config.auth, true);
  assert.equal(config.plugin, true);
  assert.equal(config.blah, true);
  assert.end();
});

tape('pulls in user config on top of default and env', async(assert) => {
  const config = await confi({
    env: 'dev',
    user: 'jga',
    userPath: path.join(__dirname, 'conf', 'users')
  });
  assert.equal(config.apikey, 'jga-key');
  assert.end();
});

tape('should allow additional config and context to be passed directly into confi', async(assert) => {
  const config = await confi({
    config: {
      customConfig: true
    },
    context: {
      customData: true
    },
    path: './test/conf'
  });
  assert.equal(config.customConfig, true);
  assert.equal(typeof config.customData, 'undefined');
  assert.end();
});

tape('should support helper functions', async(assert) => {
  const config = await confi({
    env: 'context',
    helpers: {
      getRandomNumber: () => Math.random()
    },
    path: './test/conf'
  });
  assert.equal(typeof config.context.random, 'number');
  //make sure it doesn't get added to data
  assert.equal(typeof config.getRandomNumber, 'undefined');
  assert.end();
});

//unsupported right now
tape.skip('should support helper functions that return functions', async(assert) => {
  const config = await confi({
    env: 'function-helper',
    helpers: {
      getFunction: value => function() { return value; }
    },
    path: './test/conf'
  });
  assert.equal(typeof config.context.fn, 'function');
  assert.equal(config.context.fn(), 'some value');
  assert.end();
});

tape('callback returns an error if any files fail to parse', async(assert) => {
  try {
    const config = await confi({ env: 'default', path: ['./test/dysfunctional'] });
  } catch (e) {
    assert.end();
  }
});

tape('should be able to load env vars with a specific prefix with the envVars: <prefix> option', async(assert) => {
  process.env.CONFI_SUBDOC__SUBSUB_DOC1 = 'the first part';
  process.env.CONFI_SUBDOC__SUBSUB_DOC2 = 'the second part';
  const config = await confi({ envVars: 'CONFI', path: './test/conf' });
  assert.equal(config.subdoc.subsubDoc1, 'the first part');
  assert.equal(config.subdoc.subsubDoc2, 'the second part');
  assert.end();
});

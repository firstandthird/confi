'use strict';
/*global describe, it*/
const tape = require('tape');
const confi = require('../');
const fs = require('fs');
const os = require('os');

tape('can open the default file ', (assert) => {
  const config = confi({ env: 'default' });
  assert.equal(config.host, 'localhost');
  assert.equal(config.analytics.enabled, true);
  assert.equal(config.analytics.profile, 'ga-xxx');
  assert.equal(config.env, 'default');
  assert.end();
});
tape('can open multiple paths', (assert) => {
  const config = confi({ env: 'default', path: ['./conf', './conf2'] });
  assert.equal(config.host, 'localhost');
  assert.equal(config.env, 'default');
  assert.equal(config.multiple, true);
  assert.end();
});
tape('dev env will look for ~/.confi/{project-name}.yaml', (assert) => {
  const homePath = path.join(os.homedir(), '.confi', 'my-project.yaml');
  fs.writeFile(homePath, 'homedir: "the home dir" ', (err) => {
    const config = confi();
    assert.equal(config.host, 'localhost');
    assert.equal(config.env, 'dev');
    asssert.equal(config.homedir, 'the home dir');
    assert.end();
  });
});
tape('can open the dev env', (assert) => {
  process.env.testEnv = 'test';
  const config = confi();
  assert.equal(config.host, 'localhost');
  assert.equal(config.apikey, 'asdfasdf');
  assert.equal(config.analytics.enabled, false);
  assert.equal(config.analytics.profile, 'ga-xxx');
  assert.equal(config.isTest, true);
  assert.equal(config.testHost, 'localhost/test/path');
  assert.equal(config.ENV.testEnv, 'test');
  assert.equal(config.testDefault, 123456);
  assert.equal(config.testDefault2, 'localhost');
  assert.equal(config.testDefault3, 123456);
  assert.equal(config.env, 'dev');
  assert.end();
});
tape('can open the production env', (assert) => {
  const config = confi({ env: 'production' });
  assert.equal(config.analytics.enabled, true);
  assert.equal(config.analytics.profile, 'ga-xxx');
  assert.equal(config.host, 'prod');
  assert.equal(config.env, 'production');
  assert.end();
});
tape('can open yaml files', (assert) => {
  const config = confi({ env: 'default' });
  assert.equal(config.yaml, true);
  assert.end();
});
tape('can open json files', (assert) => {
  const config = confi({ env: 'default' });
  assert.equal(config.json, true);
  assert.end();
});
tape('opens files with the environment prefix (eg default-plugin.json, default-route.yaml))', (assert) => {
  const config = confi({ env: 'default' });
  assert.equal(config.auth, true);
  assert.equal(config.plugin, true);
  assert.equal(config.blah, true);
  assert.end();
});

tape('pulls in user config on top of default and env', (assert) => {
  const config = confi({ env: 'dev', user: 'jga' });
  assert.equal(config.apikey, 'jga-key');
  assert.end();
});

tape('should allow additional context to be passed directly into confi', (assert) => {
  const config = confi({
    context: {
      customData: true
    }
  });
  assert.equal(config.customData, true);
  assert.end();
});

tape('should support helper functions', (assert) => {
  const config = confi({
    env: 'context',
    helpers: {
      getRandomNumber: () => Math.random()
    }
  });
  assert.equal(typeof config.context.random, 'number');
  //make sure it doesn't get added to data
  assert.equal(typeof config.getRandomNumber, 'undefined');
  assert.end();
});

//unsupported right now
tape.skip('should support helper functions that return functions', (assert) => {
  const config = confi({
    env: 'function-helper',
    helpers: {
      getFunction: value => function() { return value; }
    }
  });
  assert.equal(typeof config.context.fn, 'function');
  assert.equal(config.context.fn(), 'some value');
  assert.end();
});
tape('throws an error if any files fail to parse', (assert) => {
  try {
    const config = confi({ env: 'default', path: ['./dysfunctional'] });
    // if we ever reach this line then something didn't work:
    assert.equal(config, false);
  } catch (exc) {
    assert.equal(exc.message, 'Unable to parse file default.yaml');
  }
  assert.end();
});

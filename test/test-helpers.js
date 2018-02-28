'use strict';
/*global describe, it*/
const tape = require('tap').test;
const confi = require('../');
const path = require('path');

tape('ms helper', async (assert) => {
  const config = await confi({
    config: {
      oneDay: '{{ms("1d")}}'
    }
  });
  assert.deepEqual(config, {
    oneDay: 1000 * 60 * 60 * 24,
    env: 'dev'
  });
  assert.end();
});

tape('getEnv helper', async (assert) => {
  process.env.CONFI_TEST = 'yep';
  const config = await confi({
    config: {
      test: '{{getEnv("CONFI_TEST")}}'
    }
  });
  assert.deepEqual(config, {
    test: 'yep',
    env: 'dev'
  });
  assert.end();
});

tape('getEnv helper with default', async (assert) => {
  const config = await confi({
    config: {
      test: '{{getEnv("CONFI_TEST2", "nope")}}'
    }
  });
  assert.deepEqual(config, {
    test: 'nope',
    env: 'dev'
  });
  assert.end();
});

tape('getEnv helper with default', async (assert) => {
  const config = await confi({
    config: {
      math: '{{add(4, 5)}}'
    },
    helpers: {
      add(a, b) {
        return a + b;
      }
    }
  });
  assert.deepEqual(config, {
    math: 9,
    env: 'dev'
  });
  assert.end();
});

tape('getEnv helper throws error if not defined and no fallback provided', async (assert) => {
  try {
    await confi({
      config: {
        test: '{{getEnv("TheArctic")}}'
      }
    });
  } catch (e) {
    assert.equal(e.toString(), 'Environment variable TheArctic was not found and no fallback was specified');
    assert.end();
  }
});

tape('includes truthy helper', async (assert) => {
  const config = await confi({
    config: {
      stringAmbiguous: '{{truthy("ambiguous")}}',
      stringTrue: '{{truthy("true")}}',
      booleanTrue: '{{truthy(true)}}',
      stringNumTrue: '{{truthy("1")}}',
      stringNum2True: '{{truthy("10")}}',
      numTrue: '{{truthy(1)}}',
      stringFalse: '{{truthy("false")}}',
      booleanFalse: '{{truthy(false)}}',
      stringNumFalse: '{{truthy("-1")}}',
      numFalse: '{{truthy(-1)}}',
      stringNum2False: '{{truthy("-10")}}'
    }
  });
  assert.equal(config.stringTrue, true);
  assert.equal(config.booleanTrue, true);
  assert.equal(config.stringNumTrue, true);
  assert.equal(config.stringNum2True, true);
  assert.equal(config.numTrue, true);
  assert.equal(config.stringFalse, false);
  assert.equal(config.booleanFalse, false);
  assert.equal(config.stringNumFalse, false);
  assert.equal(config.stringNum2False, false);
  assert.equal(config.numFalse, false);
  assert.equal(config.stringAmbiguous, false);
  assert.end();
});

tape('readFile helper', async (assert) => {
  const config = await confi({
    config: {
      file: `{{readFile("${path.join(__dirname, 'conf2', 'default.yaml')}")}}`
    }
  });
  assert.equal(config.file.startsWith('multiple: true'), true);
  assert.end();
});

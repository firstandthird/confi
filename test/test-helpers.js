'use strict';
/*global describe, it*/
const tape = require('tap').test;
const confi = require('../');

tape('ms helper', (assert) => {
  confi({
    config: {
      oneDay: '{{ms("1d")}}'
    }
  }, (err, config) => {
    assert.equal(err, null);
    assert.deepEqual(config, {
      oneDay: 1000 * 60 * 60 * 24,
      env: 'dev'
    });
    assert.end();
  });
});

tape('getEnv helper', (assert) => {
  process.env.CONFI_TEST = 'yep';
  confi({
    config: {
      test: '{{getEnv("CONFI_TEST")}}'
    }
  }, (err, config) => {
    assert.equal(err, null);
    assert.deepEqual(config, {
      test: 'yep',
      env: 'dev'
    });
    assert.end();
  });
});

tape('getEnv helper with default', (assert) => {
  confi({
    config: {
      test: '{{getEnv("CONFI_TEST2", "nope")}}'
    }
  }, (err, config) => {
    assert.equal(err, null);
    assert.deepEqual(config, {
      test: 'nope',
      env: 'dev'
    });
    assert.end();
  });
});

tape('getEnv helper with default', (assert) => {
  confi({
    config: {
      math: '{{add(4, 5)}}'
    },
    helpers: {
      add(a, b) {
        return a + b;
      }
    }
  }, (err, config) => {
    assert.equal(err, null);
    assert.deepEqual(config, {
      math: 9,
      env: 'dev'
    });
    assert.end();
  });
});

tape('includes truthy helper', (assert) => {
  confi({
    path: './test/conf5'
  }, (err, config) => {
    assert.equal(config.stringAmbiguous, true);
    assert.equal(config.stringTrue, true);
    assert.equal(config.booleanTrue, true);
    assert.equal(config.stringNumTrue, true);
    assert.equal(config.numTrue, true);
    assert.equal(config.stringFalse, false);
    assert.equal(config.booleanFalse, false);
    assert.equal(config.stringNumFalse, false);
    assert.equal(config.numFalse, false);
    assert.end();
  });
});

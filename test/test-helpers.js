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
    assert.equal(config.oneDay, 1000 * 60 * 60 * 24);
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
    assert.equal(config.test, 'yep');
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
    assert.equal(config.test, 'nope');
    assert.end();
  });
});

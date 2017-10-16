'use strict';
/*global describe, it*/
const tape = require('tap').test;
const confi = require('../');

tape('error if missing key', (assert) => {
  confi({
    config: {
      found: '{{missing}}'
    }
  }, (err, config) => {
    assert.notEqual(err, null);
    assert.end();
  });
});

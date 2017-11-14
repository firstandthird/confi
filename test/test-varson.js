'use strict';
/*global describe, it*/
const tape = require('tap').test;
const confi = require('../');

tape('error if missing key', async (assert) => {
  try {
    const config = await confi({
      config: {
        found: '{{missing}}'
      }
    });
  } catch (e) {
    assert.notEqual(e, null);
    assert.end();
  }
});

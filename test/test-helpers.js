'use strict';
/*global describe, it*/
const confi = require('../');
const path = require('path');
const tape = require('tap').test;

tape('can load with the split helper', (assert) => {
  confi({
    configFile: path.join(__dirname, 'helpers', 'split.yaml')
  }, (err, config) => {
    assert.equal(err, null, 'does not error');
    assert.equal(config.multiple.length, 3);
    assert.end();
  });
});

tape('can load with the get helper', (assert) => {
  confi({
    configFile: path.join(__dirname, 'helpers', 'get.yaml')
  }, (err, config) => {
    assert.equal(err, null, 'does not error');
    assert.equal(config.var1, 'yes it is');
    assert.end();
  });
});

tape('can load with the if helper', (assert) => {
  confi({
    configFile: path.join(__dirname, 'helpers', 'if.yaml')
  }, (err, config) => {
    assert.equal(err, null, 'does not error');
    assert.equal(config.if1, 1, 'evaluates correctly if first expression is true');
    assert.equal(config.if1, 1, 'evalutes correctly if second expression is true');
    assert.end();
  });
});

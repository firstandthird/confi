'use strict';
/*global describe, it*/
const path = require('path');
const tape = require('tap').test;
const confi = require('../');

tape('will use defaults from package.json when the "package" option is true', (assert) => {
  const config = confi({
    package: true
  });
  assert.equal(config.goodThings, true);
  assert.end();
});
tape('keys/values parsed from package.json overwrite the corresponding keys/values in default conf', (assert) => {
  const config = confi({
    package: true
  });
  assert.equal(config.host, 'colbert');
  assert.end();
});
tape('keys/values parsed from package.json are overwritten by the corresponding keys/values in env conf', (assert) => {
  const config = confi({
    package: true,
    env: 'dev'
  });
  assert.equal(config.apikey, 'asdfasdf');
  assert.end();
});
tape('will use an alternative package.json when the "package" option is a relative path', (assert) => {
  const config = confi({
    package: 'conf4'
  });
  assert.equal(config.goodThings.comeIn, 'small packages');
  const config2 = confi({
    package: path.join('conf4', 'package.json')
  });
  assert.equal(config2.goodThings.comeIn, 'small packages');
  assert.end();
});
tape('will use "key" field from package.json when the "package" option is an object with that key', (assert) => {
  const config = confi({
    package: {
      key: "won'tUnlockThisDoor"
    }
  });
  assert.equal(config.goodThings, false);
  assert.end();
});
tape('will get package.json from a specific "path"  when indicated', (assert) => {
  const config = confi({
    package: {
      path: path.join(__dirname, 'package')
    }
  });
  assert.equal(config.aProperty, true);
  assert.end();
});
tape('will get package.json from a specific "path"  and property when indicated', (assert) => {
  const config = confi({
    package: {
      key: "won'tUnlockThisDoor",
      path: path.join(__dirname, 'package')
    }
  });
  assert.equal(config.redHouse, true);
  assert.end();
});

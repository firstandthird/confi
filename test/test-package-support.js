'use strict';
/*global describe, it*/
const path = require('path');
const tape = require('tap').test;
const confi = require('../');
process.chdir('test');

tape('will use defaults from package.json when the "package" option is true', (assert) => {
  confi({
    package: true
  }, (err, config) => {
    assert.equal(err, null);
    assert.equal(config.goodThings, true);
    assert.end();
  });
});

tape('keys/values parsed from package.json overwrite the corresponding keys/values in default conf', (assert) => {
  confi({
    package: true
  }, (err, config) => {
    assert.equal(config.host, 'colbert');
    assert.end();
  });
});

tape('keys/values parsed from package.json are overwritten by the corresponding keys/values in env conf', (assert) => {
  confi({
    package: true,
    env: 'dev',
    path: './conf'
  }, (err, config) => {
    assert.equal(config.apikey, 'asdfasdf');
    assert.end();
  });
});

tape('will use an alternative package.json when the "package" option is a relative path', (assert) => {
  confi({
    package: 'conf4'
  }, (err, config) => {
    assert.equal(config.goodThings.comeIn, 'small packages');
    const config2 = confi({
      package: path.join('conf4', 'package.json')
    }, (err2, config2) => {
      assert.equal(config2.goodThings.comeIn, 'small packages');
      assert.end();
    });
  });
});
tape('will use "key" field from package.json when the "package" option is an object with that key', (assert) => {
  confi({
    package: {
      key: "won'tUnlockThisDoor"
    }
  }, (err, config) => {
    assert.equal(config.goodThings, false);
    assert.end();
  });
});
tape('will get package.json from a specific "path"  when indicated', (assert) => {
  confi({
    package: {
      path: path.join(__dirname, 'package')
    }
  }, (err, config) => {
    assert.equal(config.aProperty, true);
    assert.end();
  });
});
tape('will get package.json from a specific "path"  and property when indicated', (assert) => {
  confi({
    package: {
      key: "won'tUnlockThisDoor",
      path: path.join(__dirname, 'package')
    }
  }, (err, config) => {
    assert.equal(config.redHouse, true);
    assert.end();
  });
});

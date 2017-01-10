'use strict';
/*global describe, it*/
const chai = require('chai');
const path = require('path');
const assert = chai.assert;
const confi = require('../');

describe('confi package.json support', () => {
  it('will use defaults from package.json when the "package" option is true', (done) => {
    const config = confi({
      package: true
    });
    assert.equal(config.goodThings, true);
    done();
  });
  it('keys/values parsed from package.json overwrite the corresponding keys/values in default conf', (done) => {
    const config = confi({
      package: true
    });
    assert.equal(config.host, 'colbert');
    done();
  });
  it('keys/values parsed from package.json are overwritten by the corresponding keys/values in env conf', (done) => {
    const config = confi({
      package: true,
      env: 'dev'
    });
    assert.equal(config.apikey, 'asdfasdf');
    done();
  });
  it('will use an alternative package.json when the "package" option is a relative path', (done) => {
    const config = confi({
      package: 'conf4'
    });
    assert.equal(config.goodThings.comeIn, 'small packages');
    const config2 = confi({
      package: path.join('conf4', 'package.json')
    });
    assert.equal(config2.goodThings.comeIn, 'small packages');
    done();
  });
  it('will use "key" field from package.json when the "package" option is an object with that key', (done) => {
    const config = confi({
      package: {
        key: "won'tUnlockThisDoor"
      }
    });
    assert.equal(config.goodThings, false);
    done();
  });
  it('will get package.json from a specific "path"  when indicated', (done) => {
    const config = confi({
      package: {
        path: path.join(__dirname, 'package')
      }
    });
    assert.equal(config.aProperty, true);
    done();
  });
  it('will get package.json from a specific "path"  and property when indicated', (done) => {
    const config = confi({
      package: {
        key: "won'tUnlockThisDoor",
        path: path.join(__dirname, 'package')
      }
    });
    assert.equal(config.redHouse, true);
    done();
  });
});

'use strict';
/*global describe, it*/
const chai = require('chai');
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
});

'use strict';
/*global describe, it*/
const chai = require('chai');
const assert = chai.assert;
const confi = require('../');
const path = require('path');

describe('confi file support', () => {
  it('can use a prefix with default env to selectively filter which files to load', (done) => {
    const config = confi({
      path: [{ path: path.join('.', 'conf3'), prefix: 'useit' }]
    });
    // should have loaded conf3/useit.yaml but not donotload-this.yaml:
    assert.equal(config.host, 'localhost');
    assert.equal(config.donotloadthis, undefined);
    // should not have loaded conf3/useit-prod since we are in default env:
    assert.equal(config.prod, undefined);
    done();
  });
  it('can use a prefix with dev env to selectively filter which files to load', (done) => {
    const config = confi({
      env: 'dev',
      path: [{ path: path.join('.', 'conf3'), prefix: 'useit' }]
    });
    // should have loaded conf3/useit.yaml (we also load this no matter the env) but not donotload-this.yaml:
    assert.equal(config.host, 'localhost');
    assert.equal(config.donotloadthis, undefined);
    // should have not loaded conf3/useit-prod.yaml since we are using the dev env:
    assert.equal(config.prod, undefined);
    // should have loaded conf3/useit-dev.yaml since we are in the dev env:
    assert.equal(config.dev, true);
    done();
  });
  it('can use a prefix with prod env to selectively filter which files to load', (done) => {
    const config = confi({
      env: 'prod',
      path: [{ path: path.join('.', 'conf3'), prefix: 'useit' }]
    });
    // should have loaded conf3/useit.yaml (we also load this no matter the env) but not donotload-this.yaml:
    assert.equal(config.host, 'localhost');
    assert.equal(config.donotloadthis, undefined);
    // should have loaded conf3/useit-prod.yaml since we are using the prod env:
    assert.equal(config.prod, true);
    // should not have loaded conf3/useit-dev.yaml since we are in the prod env:
    assert.equal(config.dev, undefined);
    done();
  });
});

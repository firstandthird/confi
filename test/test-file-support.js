'use strict';
/*global describe, it*/
const confi = require('../');
const path = require('path');
const tape = require('tap').test;

tape('can use a prefix with default env to selectively filter which files to load', async (assert) => {
  const config = await confi({ path: [{ path: path.join(__dirname, 'conf3'), prefix: 'useit' }] });
  // should have loaded conf3/useit.yaml but not donotload-this.yaml:
  assert.equal(config.host, 'localhost');
  assert.equal(config.donotloadthis, undefined);
  // should not have loaded conf3/useit-prod since we are in default env:
  assert.equal(config.prod, undefined);
  assert.end();
});

tape('can use a prefix with dev env to selectively filter which files to load', async (assert) => {
  const config = await confi({
    env: 'dev',
    path: [{ path: path.join(__dirname, 'conf3'), prefix: 'useit' }]
  });
  // should have loaded conf3/useit.yaml (we also load this no matter the env) but not donotload-this.yaml:
  assert.equal(config.host, 'localhost');
  assert.equal(config.donotloadthis, undefined);
  // should have not loaded conf3/useit-prod.yaml since we are using the dev env:
  assert.equal(config.prod, undefined);
  // should have loaded conf3/useit-dev.yaml since we are in the dev env:
  assert.equal(config.dev, 1);
  assert.end();
});

tape('can use a prefix with prod env to selectively filter which files to load', async (assert) => {
  const config = await confi({
    env: 'prod',
    path: [{ path: path.join(__dirname, 'conf3'), prefix: 'useit' }]
  });
  // should have loaded conf3/useit.yaml (we also load this no matter the env) but not donotload-this.yaml:
  assert.equal(config.host, 'localhost');
  assert.equal(config.donotloadthis, undefined);
  // should have loaded conf3/useit-prod.yaml since we are using the prod env:
  assert.equal(config.prod, true);
  // should not have loaded conf3/useit-dev.yaml since we are in the prod env:
  assert.equal(config.dev, undefined);
  assert.end();
});

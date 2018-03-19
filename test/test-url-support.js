'use strict';
/*global describe, it*/
const confi = require('../');
const tap = require('tap');
const tape = tap.test;
const Hapi = require('hapi');


tape('can fetch json config from a remote url', async(assert) => {
  const server = new Hapi.Server({ port: 8000 });
  server.route({
    method: 'GET',
    path: '/confi1',
    handler(request, h) {
      return h.response({ url1: true }).type('application/json');
    }
  });
  await server.start();
  const result = await confi({ url: 'http://localhost:8000/confi1' });
  assert.equal(result.url1, true);
  await server.stop();
  assert.end();
});

tape('can fetch yaml config from a remote url', async(assert) => {
  const server = new Hapi.Server({ port: 8000 });
  server.route({
    method: 'GET',
    path: '/confi1',
    handler(request, h) {
      return h.response('url1: true').type('application/yaml');
    }
  });
  await server.start();
  const result = await confi({ url: 'http://localhost:8000/confi1' });
  assert.equal(result.url1, true);
  await server.stop();
  assert.end();
});

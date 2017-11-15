'use strict';
/*global describe, it*/
const confi = require('../');
const tap = require('tap');
const tape = tap.test;
const async = require('async');
const Hapi = require('hapi');

let server;
tap.beforeEach((done) => {
  server = new Hapi.Server();
  server.connection({
    host: 'localhost',
    port: 8000
  });
  server.route({
    method: 'GET',
    path: '/confi2',
    handler(request, reply) {
      return reply({ url1: true });
    }
  });
  server.route({
    method: 'GET',
    path: '/confi1',
    handler(request, reply) {
      return reply('url1: true').type('application/yaml');
    }
  });
  server.start(done);
});

tap.afterEach((done) => {
  server.stop(done);
});


tape('can fetch json config from a remote url', async(assert) => {
  const result = await confi({ url: 'http://localhost:8000/confi1' });
  assert.equal(result.url1, true);
  assert.end();
});

tape('can fetch yaml config from a remote url', async(assert) => {
  const result = await confi({ url: 'http://localhost:8000/confi1' });
  assert.equal(result.url1, true);
  assert.end();
});

'use strict';
/*global describe, it*/
const confi = require('../');
const tape = require('tape');
const async = require('async');
const Hapi = require('hapi');

tape('can fetch json config from a remote url', (assert) => {
  async.autoInject({
    server(done) {
      const server = new Hapi.Server();
      server.connection({
        host: 'localhost',
        port: 8000
      });
      server.route({
        method: 'GET',
        path: '/confi1',
        handler(request, reply) {
          return reply({ url1: true });
        }
      });
      server.start(() => done(null, server));
    },
    configure(server, done) {
      confi({
        url: 'http://localhost:8000/confi1'
      }, done);
    },
    verify(server, configure, done) {
      assert.equal(configure.url1, true);
      server.stop(done);
    }
  }, assert.end);
});

tape('can fetch yaml config from a remote url', (assert) => {
  async.autoInject({
    server(done) {
      const server = new Hapi.Server();
      server.connection({
        host: 'localhost',
        port: 8000
      });
      server.route({
        method: 'GET',
        path: '/confi1',
        handler(request, reply) {
          return reply('url1: true').type('application/yaml');
        }
      });
      server.start(() => done(null, server));
    },
    configure(server, done) {
      confi({
        url: 'http://localhost:8000/confi1'
      }, done);
    },
    verify(server, configure, done) {
      assert.equal(configure.url1, true);
      server.stop(done);
    }
  }, assert.end);
});

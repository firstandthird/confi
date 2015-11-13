// exports.lab = require('lab-bdd')(require('lab'));
var Hapi = require('hapi');
var MongoClient = require('mongodb').MongoClient;
var chai = require('chai');
var assert = chai.assert;
var should = chai.should();
var _ = require("lodash");
var port = process.env.PORT || 8081;
var hapiTest = require("hapi-test");
var confi = require("../")


describe('basic json parsing', function(){
  var content;
  before(function(done){
    content = confi.load({ env: 'plugin-default', path:["./test/conf"]});
    done();
  })
  it('should be able to parse literals', function(done){
    console.log(_.keys(content))
    assert.typeOf(content.metrics.var1, 'number');
    assert.equal(content.metrics.var1, 237);
    assert.typeOf(content.metrics.enabled, 'boolean');
    assert.equal(content.metrics.enabled, false);
    assert.typeOf(content.metrics.string, 'string');
    assert.equal(content.metrics.string, 'this is a string');
    done();
  });
  it('should be able to parse boolean true/false', function(done){
    assert.typeOf(content.json2, 'boolean');
    assert.equal(content.json2, true);
    assert.typeOf(content.json3, 'boolean');
    assert.equal(content.json3, false);
    done();
  });
  it ('should be able to insert a whole sub-object', function(done){
    assert.equal(content.subobject, content.metrics);
    done();
  })
  it ('should be able to evaluate js in tags', function(done){
    assert.typeOf(content.json_js1, 'string');
    assert.equal(content.json_js1, '1,2,3');
    done();
  });
  it ('should be able to evaluate math in tags', function(done){
    assert.typeOf(content.json_math1, 'number');
    assert.equal(content.json_math1, 50);
    done();
  });
});

describe('basic yaml parsing', function(){
  var content;
  before(function(done){
    content = confi.load({env:'default', path:["./test/conf"]});
    done();
  })
  it('should be able to parse literals', function(done){
    console.log(_.keys(content))
    assert.typeOf(content.analytics.var1, 'number');
    assert.equal(content.analytics.var1, 237);
    assert.typeOf(content.analytics.enabled, 'boolean');
    assert.equal(content.analytics.enabled, false);
    assert.typeOf(content.analytics.string, 'string');
    assert.equal(content.analytics.string, 'this is a string');
    done();
  });
  it('should be able to parse boolean true/false', function(done){
    assert.typeOf(content.yaml2, 'boolean');
    assert.equal(content.yaml2, true);
    assert.typeOf(content.yaml3, 'boolean');
    assert.equal(content.yaml3, false);
    done();
  });
  it ('should be able to insert a whole sub-object', function(done){
    assert.equal(content.subobject, content.analytics);
    done();
  })
  it ('should be able to evaluate js in tags', function(done){
    assert.typeOf(content.js1, 'string');
    assert.equal(content.js1, '1,2,3');
    done();
  });
  it ('should be able to evaluate math in tags', function(done){
    assert.typeOf(content.math1, 'number');
    assert.equal(content.math1, 50);
    done();
  });
});

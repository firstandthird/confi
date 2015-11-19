var chai = require('chai');
var assert = chai.assert;
var should = chai.should();
var confi = require("../")



describe('confi', function(){
  it('can open the default file ', function(done){
    var config = confi({ env: 'default' });
    assert.equal(config.host, 'localhost');
    assert.equal(config.analytics.enabled, true);
    assert.equal(config.analytics.profile, 'ga-xxx');
    assert.equal(config.env, 'default');
    done();
  });
  it('can open multiple paths', function(done){
    var config = confi({ env: 'default', path: ['./conf', './conf2'] });
    assert.equal(config.host, 'localhost');
    assert.equal(config.env, 'default');
    assert.equal(config.multiple, true);
    done();
  });
  it('can open the dev env', function(done){
    process.env.testEnv = 'test';
    var config = confi();
    assert.equal(config.host, 'localhost');
    assert.equal(config.apikey, 'asdfasdf');
    assert.equal(config.analytics.enabled, false);
    assert.equal(config.analytics.profile, 'ga-xxx');
    assert.equal(config.isTest, true);
    assert.equal(config.testHost, 'localhost/test/path');
    assert.equal(config.ENV.testEnv, 'test');
    assert.equal(config.testDefault, '123456');
    assert.equal(config.testDefault2, 'localhost');
    assert.equal(config.testDefault3, '123456');
    assert.equal(config.env, 'dev');
    done();
  });
  it('can open the production env', function(done){
    var config = confi({ env: "production"});
    assert.equal(config.analytics.enabled, true);
    assert.equal(config.analytics.profile, 'ga-xxx');
    assert.equal(config.host, 'prod');
    assert.equal(config.env, 'production');
    done();
  });
  it('can open a user-specific env', function(done){
    console.log('This test won\'t pass unless your username is jga :/');
    var config = confi({
      env: 'dev',
      userConfig: true
    });
    assert.equal(config.analytics.enabled, true);
    done();
  });
  it('can open a user-specific env with a path', function(done){
    console.log('This test won\'t pass unless your username is jga :/');
    var config = confi({
      env: 'dev',
      userConfig: __dirname + '/conf/users'
    });
    assert.equal(config.analytics.enabled, true);
    done();
  })
});

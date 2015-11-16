var fs = require('fs');
var path = require('path');
var aug = require('aug');
var cwd = process.cwd();
var glob = require('glob');
var varson = require('varson');
var parseDir = require('parse-dir');

var defaults = {
  path: process.env.CONFI_PATH || path.join(cwd, 'conf'),
  env: process.env.NODE_ENV || 'dev',
  userConfig: false
};
var readConfig = function(configPath, env) {

  if (typeof configPath === 'string') {
    configPath = [configPath];
  }

  var obj = {};

  configPath.forEach(function(f) {
    f = path.join(f, env);
    console.log(f)
    parseDir(f+"*.{json,yaml}").forEach(function(file){
      aug(true, obj, file.contents);
    });
  });
  return obj;
};

var load = function(options) {
  var config = null;
  var opts = aug({}, defaults, options);
  var defaultConf = readConfig(opts.path, 'default');
  var envConf = readConfig(opts.path, opts.env);
  var userConf = {};
  if (opts.userConfig) {
    var userConfPath = (typeof opts.userConfig === 'string') ? opts.userConfig : opts.path;
    userConf = readConfig(userConfPath, process.env.USER);
  }
  config = aug(true, defaultConf, envConf, userConf);
  config.env = opts.env;
  config.CWD = cwd;
  config.ENV = process.env || {};
  return varson(config);
};

//backwards compatible
load.load = load;
load.reset = function() {};
module.exports = load;

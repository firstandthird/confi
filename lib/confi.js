var path = require('path');
var aug = require('aug');
var cwd = process.cwd();
var varson = require('varson');
var parseDir = require('parse-dir');

var confPath = process.env.CONFI_PATH || path.join(cwd, 'conf');
var defaults = {
  path: confPath,
  env: process.env.NODE_ENV || 'dev',
  userPath: path.join(confPath, 'users'),
  context: {}
};
var readConfig = function(configPath, env) {
  if (typeof configPath === 'string') {
    configPath = [configPath];
  }

  var obj = {};

  configPath.forEach(function(f) {
    f = path.join(f, env);
    parseDir.sync(f + '*.{json,yaml}').forEach(function(file) {
      if (!file.parsed) {
        throw Error('Unable to parse file ' + file.filename);
      }
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
  if (opts.user) {
    var userConfPath = (typeof opts.userPath === 'string') ? opts.userPath : opts.path;
    userConf = readConfig(userConfPath, opts.user);
  }
  config = aug(true, defaultConf, envConf, userConf, opts.context);
  config.env = opts.env;
  config.CWD = cwd;
  config.ENV = process.env || {};
  return varson(config);
};

//backwards compatible
load.load = load;
load.reset = function() {};
module.exports = load;

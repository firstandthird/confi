var fs = require('fs');
var path = require('path');
var aug = require('aug');
var cjson = require('cjson');
var yaml = require('js-yaml');
var cwd = process.cwd();
var glob = require('glob');
var Handlebars = require('handlebars');

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

    glob.sync(f + '*.{json,yaml}').forEach(function(file) {
      if (file.indexOf('.json') !== -1) {
        aug(true, obj, cjson.load(file));
      } else {
        aug(true, obj, yaml.load(fs.readFileSync(file, 'utf8')));
      }
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

  Handlebars.registerHelper('default', function(value, defaultVal) {
    if (typeof value === 'undefined') {
      value = defaultVal;
    }

    return new Handlebars.SafeString(value);
  });

  Handlebars.registerHelper('require', function(file) {
    return require(file);
  });

  Handlebars.registerHelper('random', function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  });

  var checks = 0;
  var configString = JSON.stringify(config);

  while (checks < 10 && /({{\w+)/i.test(configString)) {
    checks++;
    configString = Handlebars.compile(configString)(config);
    config = JSON.parse(configString);
  }

  return config;
};

load.registerHelper = function(name, fn) {
  Handlebars.registerHelper(name, fn);
};

//backwards compatible
load.load = load;
load.reset = function() {};
module.exports = load;

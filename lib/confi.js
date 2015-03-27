var fs = require('fs');
var path = require('path');
var aug = require('aug');
var cjson = require('cjson');
var yaml = require('js-yaml');
var exists = fs.existsSync || path.existsSync;
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

  var defaultConf = readConfig(opts.path, "default");
  var envConf = readConfig(opts.path, opts.env);
  var userConf = {};
  if (opts.userConfig) {
    var userConfPath = (typeof opts.userConfig === 'string') ? opts.userConfig : opts.path;
    userConf = readConfig(userConfPath, process.env.USER);
  }

  config = aug(true, defaultConf, envConf, userConf);
  config.env = opts.env;

  config.ENV = process.env || {};

  Handlebars.registerHelper('default', function(value, defaultVal) {
    if (typeof value === 'undefined') {
      value = defaultVal;
    }

    return new Handlebars.SafeString(value);
  });

  config = JSON.parse(Handlebars.compile(JSON.stringify(config))(config));

  return config;
};

var reset = function() {
  config = null;
};

//backwards compatible
load.load = load;
load.reset = reset;
module.exports = load;
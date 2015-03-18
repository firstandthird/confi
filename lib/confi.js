var fs = require('fs');
var path = require('path');
var aug = require('aug');
var cjson = require('cjson');
var yaml = require('js-yaml');
var exists = fs.existsSync || path.existsSync;
var cwd = process.cwd();

var defaults = {
  path: process.env.CONFI_PATH || path.join(cwd, 'conf'),
  env: process.env.NODE_ENV || 'dev',
  userConfig: false
};

var readConfig = function(configPath, env) {
  var f = path.join(configPath, env);
  if (exists(f+'.json')) {
    return cjson.load(f+'.json');
  } else if (exists(f+'.yaml')) {
    return yaml.load(fs.readFileSync(f+'.yaml', 'utf8'));
  }
  return {};
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
  return config;
};

var reset = function() {
  config = null;
};

//backwards compatible
load.load = load;
load.reset = reset;
module.exports = load;

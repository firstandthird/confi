var fs = require('fs');
var path = require('path');
var aug = require('aug');
var cjson = require('cjson');
var cwd = process.cwd();

var defaults = {
  path: process.env.CONFI_PATH || path.join(cwd, 'conf'),
  env: process.env.NODE_ENV || 'dev'
};

var readConfig = function(configPath, env) {
  var f = path.join(configPath, env+".json"); 
  if (path.existsSync(f)) {
    return cjson.load(f); 
  } 
  return {};
};

var config = null;
var load = function(options) {
  if (!config) {
    var opts = aug({}, defaults, options);
    
    var defaultConf = readConfig(opts.path, "default");
    var envConf = readConfig(opts.path, opts.env);

    config = aug(true, defaultConf, envConf);
  }
  return config;
};

var reset = function() {
  config = null;
};

//backwards compatible
load.load = load;
load.reset = reset;
module.exports = load;

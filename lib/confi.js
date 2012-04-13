var fs = require('fs');
var path = require('path');
var aug = require('aug');
var cwd = process.cwd();

var defaults = {
  configDirectory: process.env.CONFI_PATH || path.join(cwd, 'conf'),
  env: process.env.NODE_ENV || 'dev'
};

var readConfig = function(configPath, env) {
  var f = path.join(configPath, env+".json"); 
  if (path.existsSync(f)) {
    var conf = fs.readFileSync(f, 'utf8'); 
    return JSON.parse(conf);
  } 
  return {};
};

var load = function(options) {
  var opts = aug(true, {}, defaults, options);
  
  var defaultConf = readConfig(opts.configDirectory, "default");
  var envConf = readConfig(opts.configDirectory, opts.env);

  return aug(defaultConf, envConf);
};


//backwards compatible
load.load = load;
module.exports = load;

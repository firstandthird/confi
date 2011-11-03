var fs = require('fs');
var path = require('path');
var aug = require('aug');
var cwd = process.cwd();

var defaults = {
  configDirectory: 'conf',
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
  var opts = aug({}, defaults, options);
  var configPath = path.join(cwd, opts.configDirectory); 
  
  var defaultConf = readConfig(configPath, "default");
  var envConf = readConfig(configPath, opts.env);

  return aug(defaultConf, envConf);
};


module.exports = {
  load: load
};

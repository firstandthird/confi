'use strict';
const path = require('path');
const aug = require('aug');
const cwd = process.cwd();
const varson = require('varson');
const envload = require('envload');
const async = require('async');
const packageLoader = require('./packageLoader.js');
const readDirectoryConfig = require('./readDirectoryConfig.js');
const parseDir = require('parse-dir');

const confPath = process.env.CONFI_PATH || path.join(cwd, 'conf');
const defaults = {
  path: confPath,
  env: process.env.NODE_ENV || 'dev',
  userPath: path.join(confPath, 'users'),
  context: {},
  helpers: {}
};

const load = (options, callback) => {
  // can be called with no options:
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  if (!callback) {
    throw new Error('You must provide a callback when calling "load"');
  }
  // asynchronously load all the individual elements of the config:
  async.autoInject({
    opts(done) {
      return done(null, aug({}, defaults, options));
    },
    defaultConf(opts, done) {
      if (opts.path === false) {
        return done(null, {});
      }
      readDirectoryConfig(opts.path, 'default', done);
    },
    envConf(opts, done) {
      if (opts.path === false) {
        return done(null, {});
      }
      readDirectoryConfig(opts.path, opts.env, done);
    },
    fileConf(opts, done) {
      if (opts.configFile) {
        return parseDir(opts.configFile, (err, result) => {
          if (err) {
            return done(err);
          }
          return done(null, result[0].contents);
        });
      }
      return done(null, {});
    },
    userConf(opts, done) {
      if (opts.user) {
        const userConfPath = (typeof opts.userPath === 'string') ? opts.userPath : opts.path;
        return readDirectoryConfig(userConfPath, opts.user, done);
      }
      return done(null, {});
    },
    packageOpts(opts, done) {
      return packageLoader(opts, done);
    },
    envVarConf(opts, done) {
      if (opts.envVars) {
        return done(null, envload(opts.envVars));
      }
      return done(null, {});
    },
    //combine all the elements into one config:
    config(defaultConf, packageOpts, envConf, userConf, envVarConf, fileConf, opts, done) {
      const config = {};
      aug(true, config, defaultConf, packageOpts, envConf, fileConf, userConf, envVarConf, opts.context);
      config.env = opts.env;
      config.CWD = cwd;
      config.ENV = process.env || {};
      return done(null, config);
    }
  }, (err, results) => {
    if (err) {
      return callback(err);
    }
    return callback(null, varson(results.config, results.opts.helpers));
  });
};

//backwards compatible
load.load = load;
load.reset = function() {};
module.exports = load;

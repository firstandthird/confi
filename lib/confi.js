'use strict';
const path = require('path');
const aug = require('aug');
const cwd = process.cwd();
const varson = require('varson');
const envload = require('envload');
const async = require('async');
const yaml = require('js-yaml');
const packageLoader = require('./packageLoader.js');
const wreck = require('wreck');
const readDirectoryConfig = require('./readDirectoryConfig.js');
const parseDir = require('parse-dir');
const ms = require('ms');
const truthy = require('./truthy.js');
const readFile = require('./readFile');

const confPath = process.env.CONFI_PATH || path.join(cwd, 'conf');
const defaults = {
  path: confPath,
  env: process.env.NODE_ENV || 'dev',
  userPath: path.join(confPath, 'users'),
  context: {},
  config: {},
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
    urlConf(opts, done) {
      if (!opts.url) {
        return done(null, {});
      }
      wreck.get(opts.url, (err, res, payload) => {
        if (err) {
          return done(err);
        }
        // handles json:
        const contentType = res.headers['content-type'];
        if (contentType.indexOf('application/json') > -1) {
          return done(null, JSON.parse(payload.toString()));
        }
        if (contentType.indexOf('application/yaml') > -1 || contentType.indexOf('text/yaml') > -1) {
          return done(null, yaml.safeLoad(payload.toString()));
        }
        done(new Error('invalid content type for config url'));
      });
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
    config(defaultConf, packageOpts, envConf, userConf, urlConf, envVarConf, fileConf, opts, done) {
      const config = aug(defaultConf, packageOpts, envConf, fileConf, urlConf, userConf, envVarConf, opts.config);
      config.env = opts.env;
      return done(null, config);
    },
    defaultHelpers(done) {
      done(null, {
        ms,
<<<<<<< HEAD
        truthy,
=======
        readFile,
>>>>>>> master
        getEnv(key, fallback) {
          return process.env[key] || fallback;
        }
      });
    },
    context(opts, defaultHelpers, done) {
      const context = aug({
        env: opts.env,
        CWD: cwd,
        ENV: process.env || {}
      }, opts.context, defaultHelpers, opts.helpers);
      done(null, context);
    },
    varson(context, config, done) {
      let obj;
      try {
        obj = varson(config, context);
      } catch (e) {
        return done(e);
      }
      done(null, obj);
    }
  }, (err, results) => {
    if (err) {
      return callback(err);
    }
    return callback(null, results.varson);
  });
};

//backwards compatible
load.load = load;
load.reset = function() {};
module.exports = load;

'use strict';
const path = require('path');
const aug = require('aug');
const cwd = process.cwd();
const varson = require('varson');
const parseDir = require('parse-dir');
const confPath = process.env.CONFI_PATH || path.join(cwd, 'conf');
const defaults = {
  path: confPath,
  env: process.env.NODE_ENV || 'dev',
  userPath: path.join(confPath, 'users'),
  context: {},
  helpers: {}
};

const readConfig = (configPath, env) => {
  if (typeof configPath === 'string') {
    configPath = [configPath];
  }
  const obj = {};

  configPath.forEach((f) => {
    if (typeof f === 'string') {
      f = path.join(f, env);
    } else {
      if (env === 'default') {
        f = path.join(f.path, f.prefix);
      } else {
        f = path.join(f.path, `${f.prefix}-${env}`);
      }
    }
    parseDir.sync(`${f}*.{json,yaml}`).forEach((file) => {
      if (!file.parsed) {
        throw Error(`Unable to parse file ${file.filename}`);
      }
      aug(true, obj, file.contents);
    });
  });
  return obj;
};

const load = (options) => {
  let config = null;
  const opts = aug({}, defaults, options);
  const defaultConf = readConfig(opts.path, 'default');
  const envConf = readConfig(opts.path, opts.env);
  let userConf = {};
  if (opts.user) {
    const userConfPath = (typeof opts.userPath === 'string') ? opts.userPath : opts.path;
    userConf = readConfig(userConfPath, opts.user);
  }
  config = aug(true, defaultConf, envConf, userConf, opts.context);
  config.env = opts.env;
  config.CWD = cwd;
  config.ENV = process.env || {};
  return varson(config, opts.helpers);
};

//backwards compatible
load.load = load;
load.reset = function() {};
module.exports = load;

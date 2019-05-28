'use strict';
const path = require('path');
const aug = require('aug');
const cwd = process.cwd();
const varson = require('varson');
const envload = require('envload');
const packageLoader = require('./packageLoader.js');
const readDirectoryConfig = require('./readDirectoryConfig.js');
const readUrl = require('./readUrl');
const parseDir = require('parse-dir');
const confiHelpers = require('confi-helpers');
const confPath = process.env.CONFI_PATH || path.join(cwd, 'conf');
const defaults = {
  path: confPath,
  env: process.env.NODE_ENV || 'dev',
  userPath: path.join(confPath, 'users'),
  context: {},
  config: {},
  helpers: {}
};

const load = async(options) => {
  // can be called with no options:
  if (!options) {
    options = {};
  }

  // first get all configuration options together:
  const opts = aug({}, defaults, options);

  // now load all the individual elements of the config:

  // default config:
  let defaultConf = {};
  if (opts.path) {
    defaultConf = await readDirectoryConfig(opts.path, 'default');
  }

  // url config:
  let urlConf = {};
  if (opts.url) {
    urlConf = await readUrl(opts.url);
  }

  // env config:
  let envConf = {};
  if (opts.path !== false) {
    envConf = await readDirectoryConfig(opts.path, opts.env);
  }

  // file config;
  let fileConf = {};
  if (opts.configFile) {
    const result = await parseDir(opts.configFile);
    fileConf = result[0].contents;
  }

  // user-specific config:
  let userConf = {};
  if (opts.user) {
    const userConfPath = (typeof opts.userPath === 'string') ? opts.userPath : opts.path;
    userConf = await readDirectoryConfig(userConfPath, opts.user);
  }
  const packageOpts = await packageLoader(opts);

  // env variable config:
  let envVarConf = {};
  if (opts.envVars) {
    envVarConf = envload(opts.envVars);
  }

  // now combine all the elements of the config into one final unparsed config:
  const config = aug(defaultConf, packageOpts, envConf, fileConf, urlConf, userConf, envVarConf, opts.config);
  config.env = opts.env;
  const defaultHelpers = confiHelpers;

  // set up the context in which the configs will be parsed by varson:
  const context = aug({
    env: opts.env,
    CWD: cwd,
    ENV: process.env || {}
  }, opts.context, defaultHelpers, opts.helpers);

  // now parse the entire config with varson and return it:
  return varson(config, context);
};

module.exports = load;

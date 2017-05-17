'use strict';
const path = require('path');

module.exports = (options, done) => {
  if (!options.package) {
    return done(null, {});
  }
  let fileName = 'package.json';
  let includePath = process.cwd();// path.join(process.cwd(), 'package.json');
  let key = 'confi';
  if (typeof options.package === 'object') {
    if (options.package.key) {
      key = options.package.key;
    }
    if (options.package.path) {
      includePath = options.package.path;
    }
  } else if (typeof options.package === 'string') {
    if (options.package.indexOf('package.json') > -1) {
      fileName = options.package;
    } else {
      fileName = path.join(options.package, 'package.json');
    }
  }
  const foreignPackage = require(path.join(includePath, fileName));
  return done(null, foreignPackage[key] ? foreignPackage[key] : {});
};
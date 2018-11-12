'use strict';
const path = require('path');
const fs = require('fs');

module.exports = async(options) => {
  if (!options.package) {
    return {};
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
  const file = path.join(includePath, fileName);
  if (await new Promise(resolve => fs.access(file, fs.constants.F_OK, err => resolve(err === null)))) {
    const foreignPackage = require(file);
    return foreignPackage[key] ? foreignPackage[key] : {};
  }
  return {};
};

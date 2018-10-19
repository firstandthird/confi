const fs = require('fs');

'use strict';
const path = require('path');

module.exports = (options) => {
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
  try {
    const foreignPackage = require(path.join(includePath, fileName));
    return foreignPackage[key] ? foreignPackage[key] : {};
  } catch (e) {
    console.log(e);
  }
};

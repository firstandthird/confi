'use strict';
const path = require('path');
const parseDir = require('parse-dir');
const aug = require('aug');

module.exports = async (listOfPaths, env) => {
  if (typeof listOfPaths === 'string') {
    listOfPaths = [listOfPaths];
  }
  const pathNames = listOfPaths.map(filePath => {
    if (typeof filePath === 'string') {
      filePath = `${path.join(filePath, env)}*`;
    } else {
      if (env === 'default') {
        // only load the main file yaml/json file matching the prefix:
        filePath = path.join(filePath.path, filePath.prefix);
      } else {
        // only load the yaml/json file for this env:
        filePath = path.join(filePath.path, `${filePath.prefix}-${env}`);
      }
    }
    return filePath;
  });
  const parsePaths = await Promise.all(pathNames.map(filePath => parseDir(`${filePath}.{json,yaml}`)));
  let obj = {};
  for (let i = 0; i < parsePaths.length; i++) {
    for (let j = 0; j < parsePaths[i].length; j++) {
      const file = parsePaths[i][j];
      if (!file.parsed) {
        throw new Error(`Unable to parse file ${file.filename}`);
      }
      obj = aug(obj, file.contents);
    }
  }
  return obj;
};

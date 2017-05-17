'use strict';
const async = require('async');
const path = require('path');
const parseDir = require('parse-dir');
const aug = require('aug');

module.exports = (listOfPaths, env, callback) => {
  if (typeof listOfPaths === 'string') {
    listOfPaths = [listOfPaths];
  }
  async.autoInject({
    pathNames(done) {
      return done(null, listOfPaths.map((filePath) => {
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
      }));
    },
    parsePaths(pathNames, done) {
      async.map(pathNames, (filePath, eachDone) => {
        parseDir(`${filePath}.{json,yaml}`, eachDone);
      }, done);
    },
    populateObj(parsePaths, done) {
      const obj = {};
      for (let i = 0; i < parsePaths.length; i++) {
        for (let j = 0; j < parsePaths[i].length; j++) {
          const file = parsePaths[i][j];
          if (!file.parsed) {
            return done(new Error(`Unable to parse file ${file.filename}`));
          }
          aug(true, obj, file.contents);
        }
      }
      return done(null, obj);
    }
  }, (err, results) => {
    if (err) {
      return callback(err);
    }
    return callback(null, results.populateObj);
  });
};

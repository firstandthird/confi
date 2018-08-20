const readFile = require('./readFile');

module.exports = function(variableName) {
  const fileName = process.env[`${variableName}_FILE`];
  if (fileName) {
    return readFile(fileName);
  }
  return process.env[variableName];
};

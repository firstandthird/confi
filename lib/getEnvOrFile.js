const readFile = require('./readFile');
const getEnv = require('./getEnv');

module.exports = function(variableName) {
  const fileName = process.env[`${variableName}_FILE`];
  if (fileName) {
    return readFile(fileName);
  }
  return getEnv(variableName);
};

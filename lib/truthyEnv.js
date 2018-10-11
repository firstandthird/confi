module.exports = function(val, defaultVal = false) {
  const result = process.env[val];
  if (result === undefined || result === null) {
    return defaultVal;
  }
  return (result === '1' || result === true || result === 'true');
};

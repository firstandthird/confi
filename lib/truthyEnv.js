module.exports = function(val, defaultVal = false) {
  const result = process.env[val];
  if (result === undefined || result === null || result === '') {
    return defaultVal;
  }
  return (result === '1' || result === true || result === 'true');
};

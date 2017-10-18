module.exports = function(val) {
  if (val === 'true' || val === '1' || val === 1) {
    return true;
  }
  return val;
};

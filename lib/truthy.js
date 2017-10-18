module.exports = function(val) {
  // check for string truthiness:
  if (typeof val === 'boolean') {
    return val;
  }
  if (typeof val === 'string') {
    const numeric = parseFloat(val);
    if (!isNaN(numeric)) {
      return numeric > -1;
    }
    return val.toLowerCase() === 'true';
  }
  // check for numerical truthiness:
  if (typeof val === 'number') {
    return val > -1;
  }
};

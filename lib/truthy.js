module.exports = function(val, defaultVal = false) {
  // boolean truthiness is automatic:
  if (typeof val === 'boolean') {
    return val;
  }
  // check for string truthiness:
  if (typeof val === 'string') {
    const numeric = parseFloat(val);
    if (!isNaN(numeric)) {
      return numeric > 0;
    }
    return val.toLowerCase() === 'true';
  }
  // check for numerical truthiness:
  if (typeof val === 'number') {
    return val > 0;
  }
  if (val === undefined || val === null) {
    return defaultVal;
  }
};

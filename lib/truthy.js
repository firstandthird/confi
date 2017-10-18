module.exports = function(val) {
  // check for string truthiness:
  if (val === 'false' || val === false) {
    return false;
  }
  if (val === 'true' || val === true) {
    return true;
  }
  // check for numerical truthiness:
  if (parseFloat(val) < 0) {
    return false;
  }
  // otherwise it was a non-negative number or string we will interpret as true:
  return true;
};

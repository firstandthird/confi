module.exports = (value) => {
  if (value === undefined || value === null || value === '') {
    return false;
  }
  return true;
};

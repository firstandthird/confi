module.exports = function getEnv(key, fallback) {
  const env = process.env[key] || fallback;
  if (typeof env === 'undefined') {
    throw new Error(`Environment variable ${key} was not found and no fallback was specified`);
  }
  return parseInt(env, 10);
};

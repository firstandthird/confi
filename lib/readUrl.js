const wreck = require('wreck');
const yaml = require('js-yaml');

module.exports = async (url) => {
  const { res, payload } = await wreck.get(url);
  // handles json:
  const contentType = res.headers['content-type'];
  if (contentType.indexOf('application/json') > -1) {
    return JSON.parse(payload.toString());
  } else if (contentType.indexOf('application/yaml') > -1 || contentType.indexOf('text/yaml') > -1) {
    return yaml.safeLoad(payload.toString());
  }
  throw new Error('invalid content type for config url');
};

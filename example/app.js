var config = require('../')();


config.test = 1234;

require('./module');
console.log("app.js:")
console.log(config);

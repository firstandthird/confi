const config = require('../')();


config.test = 1234;

require('./module');
console.log(config);

const initHandler = require('./handlers/init');
const addHandler = require('./handlers/add');
const deployHandler = require('./handlers/deploy');

module.exports = {
  init: {
    handler: initHandler
  },
  add: {
    handler: addHandler
  },
  deploy: {
    handler: deployHandler
  }
};

const initHandler = require('./handlers/init');
const addHandler = require('./handlers/add');

module.exports = {
  init: {
    handler: initHandler
  },
  add: {
    handler: addHandler,
  },
  deploy: {
    handler: () => {}
  }
}
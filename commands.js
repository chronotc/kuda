const Context = require('./context');
const fileHandlerFactory = require('./lib/file-handler-factory');
fileHandlerFactory.init();

const context = new Context({ fileHandlerFactory });

module.exports = {
  init: {
    handler: context.createInitCommandHandler().handle
  },
  add: {
    handler: context.createAddCommandHandler().handle
  },
  deploy: {
    handler: context.createDeployCommandHandler().handle
  }
};

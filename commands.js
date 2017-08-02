const prompts = require('./lib/prompts');
const fileHandler = require('./lib/file-handler');
const KudaJsonHandler = require('./lib/kuda-json-handler');
const PackageJsonHandler = require('./lib/package-json-handler');
const taskHandler = require('./lib/task-handler');
const ServiceHandler = require('./lib/service-handler');
const RemoteStateHandler = require('./lib/remote-state-handler');

const DeployCommandHandler = require('./command-handlers/deploy');
const AddCommandHandler = require('./command-handlers/add');
const InitCommandHandler = require('./command-handlers/init');

const kudaJsonHandler = new KudaJsonHandler({ fileHandler });
const packageJsonHandler = new PackageJsonHandler({ fileHandler });
const remoteStateHandler = new RemoteStateHandler({ kudaJsonHandler });

const serviceHandler = new ServiceHandler({ taskHandler, remoteStateHandler, packageJsonHandler });

const addCommandHandler = new AddCommandHandler({ kudaJsonHandler, packageJsonHandler, prompts });
const deployCommandHandler = new DeployCommandHandler({ kudaJsonHandler, serviceHandler });
const initCommandHandler = new InitCommandHandler({ kudaJsonHandler, packageJsonHandler, prompts });

module.exports = {
  init: {
    handler: initCommandHandler.handle
  },
  add: {
    handler: addCommandHandler.handle
  },
  deploy: {
    handler: deployCommandHandler.handle
  }
};

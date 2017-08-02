const path = require('path');

const fileHandler = require('../lib/file-handler');
const taskHandler = require('../lib/task-handler');
const ServiceHandler = require('../lib/service-handler');
const RemoteStateHandler = require('../lib/remote-state-handler');
const PackageJsonHandler = require('../lib/package-json-handler');
const KudaJsonHandler = require('../lib/kuda-json-handler');
const DeployCommandHandler = require('../lib/deploy-command-handler');

const packageJsonHandler = new PackageJsonHandler({ fileHandler });
const kudaJsonHandler = new KudaJsonHandler({ fileHandler });
const remoteStateHandler = new RemoteStateHandler({ kudaJsonHandler });

const serviceHandler = new ServiceHandler({ taskHandler, remoteStateHandler, packageJsonHandler });
const deployCommandHandler = new DeployCommandHandler({ fileHandler, serviceHandler });

const KUDA_JSON_FILE_PATH = path.resolve(process.cwd(), 'kuda.json');

module.exports = () => {
  return deployCommandHandler.deployRegisteredServices();
};


const path = require('path');

const fileHandler = require('../lib/file-handler');
const taskHandler = require('../lib/task-handler');
const ServiceHandler = require('../lib/service-handler');
const RemoteStateHandler = require('../lib/remote-state-handler');
const PackageJsonHandler = require('../lib/package-json-handler');
const PitJsonHandler = require('../lib/pit-json-handler');
const DeployCommandHandler = require('../lib/deploy-command-handler');

const packageJsonHandler = new PackageJsonHandler({ fileHandler });
const pitJsonHandler = new PitJsonHandler({ fileHandler });
const remoteStateHandler = new RemoteStateHandler({ pitJsonHandler });

const serviceHandler = new ServiceHandler({ taskHandler, remoteStateHandler, packageJsonHandler });
const deployCommandHandler = new DeployCommandHandler({ fileHandler, serviceHandler });

const PIT_JSON_FILE_PATH = path.resolve(process.cwd(), 'pit.json');

module.exports = () => {
  return deployCommandHandler.deployRegisteredServices();
};


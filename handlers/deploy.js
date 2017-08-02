const path = require('path');

const fileHandler = require('../lib/file-handler');
const taskHandler = require('../lib/task-handler');
const ServiceHandler = require('../lib/service-handler');
const DeployCommandHandler = require('../lib/deploy-command-handler');

const serviceHandler = new ServiceHandler({ fileHandler, taskHandler });
const deployCommandHandler = new DeployCommandHandler({ fileHandler, serviceHandler });

const PIT_JSON_FILE_PATH = path.resolve(process.cwd(), 'pit.json');

module.exports = () => {
  return deployCommandHandler.deployRegisteredServices();
};


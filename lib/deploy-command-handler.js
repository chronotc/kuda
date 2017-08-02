const autoBind = require('auto-bind');
const path = require('path');
const Bluebird = require('bluebird');
const { get } = require('lodash');

class DeployCommandHandler {
  constructor ({ fileHandler, serviceHandler }) {
    this.fileHandler = fileHandler;
    this.serviceHandler = serviceHandler;

    autoBind(this);
  }

  deployRegisteredServices () {
    const kudaJsonPath = path.resolve(process.cwd(), 'kuda.json');
    const kudaJsonPathExist = this.fileHandler.exists(kudaJsonPath);

    if (!kudaJsonPathExist) {
      throw new Error(`Could not find a kuda.json file`);
    }

    return this.fileHandler.readJson(kudaJsonPath)
      .then(kudaJson => {
        const services = get(kudaJson, 'services', []);
        const serviceExecutables = services.map(service => () => this.serviceHandler.deployService(service.name));
        return Bluebird.mapSeries(serviceExecutables, promise => promise());
      });
  }
}

module.exports = DeployCommandHandler;

const autoBind = require('auto-bind');
const path = require('path');
const Bluebird = require('bluebird');
const { get } = require('lodash');

class DeployCommandHandler {
  constructor({ fileHandler, serviceHandler }) {
    this.fileHandler = fileHandler;
    this.serviceHandler = serviceHandler;

    autoBind(this);
  }

  deployRegisteredServices() {
    const pitJsonPath = path.resolve(process.cwd(), 'pit.json');
    const pitJsonPathExist = this.fileHandler.exists(pitJsonPath);

    if (!pitJsonPathExist) {
      throw new Error(`Could not find a pit.json file`);
    }

    return this.fileHandler.readJson(pitJsonPath)
      .then(pitJson => {
        const services = get(pitJson, 'services', []);
        const serviceExecutables = services.map(service => () => this.serviceHandler.deployService(service.name));
        return Bluebird.mapSeries(serviceExecutables, promise => promise());
      });
  }
}

module.exports = DeployCommandHandler;
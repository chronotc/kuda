const autoBind = require('auto-bind');
const path = require('path');
const { get } = require('lodash');

class AddServiceCommandHandler {
  constructor({ fileHandler }) {
    this.fileHandler = fileHandler;

    autoBind(this);
  }

  generateInitialPitConfig(filePath, packageJson) {
    if (packageJson.pit) {
      return Promise.resolve(packageJson);
    }

    console.log('Writing initial pit config ...');

    const pit = {
      tasks: []
    };
    const json = Object.assign({}, packageJson, { pit });

    return this.fileHandler.writeJson(filePath, json);
  }

  addService(service) {
    return this.addServiceToPitJson(service)
      .then(() => this.addServiceToPackageJson(service));
  }

  addServiceToPackageJson(service) {
    const packageJsonPath = path.resolve(process.cwd(), service, 'package.json');
    const servicePathExist = this.fileHandler.exists(packageJsonPath);

    if (!servicePathExist) {
      throw new Error(`Could not find a package.json file inside service: "${service}"`);
    }

    return this.fileHandler.readJson(packageJsonPath)
      .then(data => this.generateInitialPitConfig(packageJsonPath, data));
  }

  addServiceToPitJson(service) {
    const pitJsonPath = path.resolve(process.cwd(), 'pit.json');
    const pitJsonPathExist = this.fileHandler.exists(pitJsonPath);

    if (!pitJsonPathExist) {
      throw new Error(`Could not find a pit.json file`);
    }

    return this.fileHandler.readJson(pitJsonPath)
      .then(pitJson => {
        const services = get(pitJson, 'services', []);
        const serviceExist = services.find(({ name }) => name === service);

        if (serviceExist) {
          return Promise.resolve(pitJson);
        }

        services.push({ name: service });
        const updatedPitJson = Object.assign({}, pitJson, { services });

        return this.fileHandler.writeJson(pitJsonPath, updatedPitJson)
          .then(() => updatedPitJson);
      });
  }
}

module.exports = AddServiceCommandHandler;
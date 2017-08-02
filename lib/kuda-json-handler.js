const autoBind = require('auto-bind');
const path = require('path');
const { get, property } = require('lodash');

class KudaJsonHandler {
  constructor ({ fileHandler }) {
    this.fileHandler = fileHandler;
    this.kudaJsonPath = path.resolve(process.cwd(), 'kuda.json');

    autoBind(this);
  }

  checkFile () {
    const kudaJsonPathExist = this.fileHandler.exists(this.kudaJsonPath);

    if (!kudaJsonPathExist) {
      throw new Error(`Could not find a kuda.json file`);
    }
  }

  writeService (service) {
    this.checkFile();

    return this.fileHandler.readJson(this.kudaJsonPath)
      .then(kudaJson => {
        const services = get(kudaJson, 'services', []);
        const serviceExist = services.find(({ name }) => name === service);

        if (serviceExist) {
          return Promise.resolve(kudaJson);
        }

        services.push({ name: service });
        const updatedKudaJson = Object.assign({}, kudaJson, { services });

        return this.fileHandler.writeJson(this.kudaJsonPath, updatedKudaJson)
          .then(() => updatedKudaJson);
      });
  }

  readRemoteStatePath () {
    this.checkFile();

    return this.fileHandler.readJson(this.kudaJsonPath)
      .then(property('remoteState'));
  }

  writeRemoteStatePath (remotePath) {
    this.checkFile();

    return this.fileHandler.readJson(this.kudaJsonPath)
      .then(kudaJson => {
        const remoteState = get(kudaJson, 'remoteState', remotePath);
        const updatedKudaJson = Object.assign({}, kudaJson, { remoteState });

        return this.fileHandler.writeJson(this.kudaJsonPath, updatedKudaJson)
          .then(() => updatedKudaJson);
      });
  }
}

module.exports = KudaJsonHandler;

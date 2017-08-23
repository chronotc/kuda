const autoBind = require('auto-bind');
const path = require('path');
const { get, property } = require('lodash');
const format = require('string-template');

class KudaJsonHandler {
  constructor ({ fileHandler }) {
    this.fileHandler = fileHandler;
    this.kudaJsonPath = path.resolve(process.cwd(), 'kuda.json');

    autoBind(this);
  }

  verifyConfigFile () {
    const kudaJsonPathExist = this.doesConfigFileExist();

    if (!kudaJsonPathExist) {
      throw new Error(`Could not find a kuda.json file`);
    }
  }

  doesConfigFileExist () {
    return this.fileHandler.exists(this.kudaJsonPath);
  }

  writeEmptyFile () {
    return this.fileHandler.writeJson(this.kudaJsonPath, {});
  }

  readAllServices () {
    this.verifyConfigFile();

    return this.fileHandler.readJson(this.kudaJsonPath)
      .then(property('services'));
  }

  writeService (service) {
    this.verifyConfigFile();

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
    this.verifyConfigFile();

    return this.fileHandler.readJson(this.kudaJsonPath)
      .then(property('remoteState'))
      .then(remoteState => format(remoteState, process.env))
      .tap(remoteState => console.log(`Reading state from: ${remoteState}`));
  }

  writeRemoteStatePath (remotePath) {
    this.verifyConfigFile();

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

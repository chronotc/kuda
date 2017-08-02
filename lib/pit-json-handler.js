const autoBind = require('auto-bind');
const path = require('path');
const { get, property } = require('lodash');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({apiVersion: '2006-03-01'});


class PitJsonHandler {
  constructor({ fileHandler }) {
    this.fileHandler = fileHandler;
    this.pitJsonPath = path.resolve(process.cwd(), 'pit.json');

    autoBind(this);
  }

  checkFile() {
    const pitJsonPathExist = this.fileHandler.exists(this.pitJsonPath);

    if (!pitJsonPathExist) {
      throw new Error(`Could not find a pit.json file`);
    }
  }

  writeService(service) {
    this.checkFile();

    return this.fileHandler.readJson(this.pitJsonPath)
      .then(pitJson => {
        const services = get(pitJson, 'services', []);
        const serviceExist = services.find(({ name }) => name === service);

        if (serviceExist) {
          return Promise.resolve(pitJson);
        }

        services.push({ name: service });
        const updatedPitJson = Object.assign({}, pitJson, { services });

        return this.fileHandler.writeJson(this.pitJsonPath, updatedPitJson)
          .then(() => updatedPitJson);
      });
  }

  readRemoteStatePath() {
    this.checkFile();

    return this.fileHandler.readJson(this.pitJsonPath)
      .then(property('remoteState'))
  }

  writeRemoteStatePath(remotePath) {
    this.checkFile();

    return this.fileHandler.readJson(this.pitJsonPath)
      .then(pitJson => {
        const remoteState = get(pitJson, 'remoteState', remotePath);
        const updatedPitJson = Object.assign({}, pitJson, { remoteState });

        return this.fileHandler.writeJson(this.pitJsonPath, updatedPitJson)
          .then(() => updatedPitJson);
      });
  }
}

module.exports = PitJsonHandler;
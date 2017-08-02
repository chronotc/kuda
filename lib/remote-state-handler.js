const autoBind = require('auto-bind');
const path = require('path');
const { get } = require('lodash');

class RemoteStateHandler {
  constructor({ fileHandler }) {
    this.fileHandler = fileHandler;

    autoBind(this);
  }

  updateRemoteStateInPitJson(remotePath) {
    const pitJsonPath = path.resolve(process.cwd(), 'pit.json');
    const pitJsonPathExist = this.fileHandler.exists(pitJsonPath);

    if (!pitJsonPathExist) {
      throw new Error(`Could not find a pit.json file`);
    }

    return this.fileHandler.readJson(pitJsonPath)
      .then(pitJson => {
        const remoteState = get(pitJson, 'remoteState', remotePath);
        const updatedPitJson = Object.assign({}, pitJson, { remoteState });

        return this.fileHandler.writeJson(pitJsonPath, updatedPitJson)
          .then(() => updatedPitJson);
      });
  }
}

module.exports = RemoteStateHandler;
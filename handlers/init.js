const fileHandler = require('../lib/file-handler');
const path = require('path');
const { promptNewService, promptRemoteState } = require('../lib/prompts');

const PIT_JSON_FILE_PATH = path.resolve(process.cwd(), 'pit.json');

module.exports = () => {
  const exists = fileHandler.exists(PIT_JSON_FILE_PATH);
  if (exists) {
    return console.log('pit.json file exist. Repository is already initialized!');
  }

  let pitJson = {
    services: [],
    remoteState: ''
  };

  return promptNewService()
    .then(service => {
      pitJson.services.push({ name: service });
      return fileHandler.verifyPackageJson(service);
    })
    .then(() => promptRemoteState())
    .then(remoteState => pitJson.remoteState = remoteState)
    .then(() => fileHandler.writeJson(PIT_JSON_FILE_PATH, pitJson));
};


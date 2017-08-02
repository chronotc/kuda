const fileHandler = require('../lib/file-handler');
const path = require('path');
const { promptNewService, promptRemoteState } = require('../lib/prompts');

const PIT_JSON_FILE_PATH = path.resolve(process.cwd(), 'pit.json');

module.exports = () => {
  const exists = fileHandler.exists(PIT_JSON_FILE_PATH);
  if (!exists) {
    return console.error(`Could not find pit.json in ${PIT_JSON_FILE_PATH}`);
  }

  return promptNewService()
    .then(service => fileHandler.addService(service))
    .then(() => promptRemoteState())
    .then(remoteState => pitJson.remoteState = remoteState)
    .then(() => fileHandler.writeJson(PIT_JSON_FILE_PATH, pitJson));
};


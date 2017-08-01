const fileHandler = require('../lib/file-handler');
const path = require('path');
const { promptNewService, promptRemoteState } = require('../lib/prompts');

const CWD = process.cwd();
const INIT_FILE_PATH = path.resolve(CWD, 'pit.json');

module.exports = () => {
  const exists = fileHandler.exists(INIT_FILE_PATH);
  if (exists) {
    return console.log('pit.json file exist. Repository is already initialized!');
  }

  let initFile = {
    services: [],
    remoteState: ''
  };

  return promptNewService()
    .then(service => {
      const servicePathExist = fileHandler.exists(path.resolve(CWD, service));

      if (!servicePathExist) {
        throw new Error(`Could not find service: "${service}" specified`);
      }

      initFile.services.push({ name: service });
    })
    .then(() => promptRemoteState())
    .then(remoteState => initFile.remoteState = remoteState)
    .then(() => fileHandler.writeJson(INIT_FILE_PATH, initFile));
};


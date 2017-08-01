const Bluebird = require('bluebird');
const fs = Bluebird.promisifyAll(require('fs'));
const path = require('path');
const { promptNewService, promptRemoteState } = require('../lib/prompts');

const CWD = process.cwd();
const INIT_FILE_PATH = path.resolve(CWD, 'pit.json');

module.exports = () => {
  const exists = fs.existsSync(INIT_FILE_PATH);
  if (exists) {
    return console.log('pit.json file exist. Repository is already initialized!');
  }

  let initFile = {
    services: [],
    remoteState: ''
  };

  return promptNewService()
    .then(service => {
      const servicePathExist = fs.existsSync(path.resolve(CWD, service));

      if (!servicePathExist) {
        throw new Error(`Could not find service: "${service}" specified`);
      }

      initFile.services.push({ name: service });
    })
    .then(() => promptRemoteState())
    .then(remoteState => initFile.remoteState = remoteState)
    .then(() => writeJsonToFile(initFile));
};

function writeJsonToFile(json) {
  const contents = JSON.stringify(json, null, 2);
  return fs.writeFileAsync(INIT_FILE_PATH, contents);
}

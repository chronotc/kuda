const path = require('path');

const { promptNewService, promptRemoteState } = require('../lib/prompts');
const fileHandler = require('../lib/file-handler');
const PitJsonHandler = require('../lib/pit-json-handler');
const PackageJsonHandler = require('../lib/package-json-handler');
const RemoteStateHandler = require('../lib/remote-state-handler');

const pitJsonHandler = new PitJsonHandler({ fileHandler });
const packageJsonHandler = new PackageJsonHandler({ fileHandler });
const remoteStateHandler = new RemoteStateHandler({ pitJsonHandler });

const PIT_JSON_FILE_PATH = path.resolve(process.cwd(), 'pit.json');

module.exports = () => {
  const exists = fileHandler.exists(PIT_JSON_FILE_PATH);
  // if (exists) {
  //   return console.error('pit.json file exist. Repository is already initialized!');
  // }

  return fileHandler.writeJson(PIT_JSON_FILE_PATH, {})
    .then(() => promptNewService())
    .then(service =>
      Promise.all([
        pitJsonHandler.writeService(service),
        packageJsonHandler.writeService(service)
      ])
    )
    .then(() => promptRemoteState())
    .then(remoteStatePath => pitJsonHandler.writeRemoteStatePath(remoteStatePath))
    .then(() => remoteStateHandler.createEmptyState())
    .catch(console.error);
};


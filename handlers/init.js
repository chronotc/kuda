const path = require('path');

const { promptNewService, promptRemoteState } = require('../lib/prompts');
const fileHandler = require('../lib/file-handler');
const KudaJsonHandler = require('../lib/kuda-json-handler');
const PackageJsonHandler = require('../lib/package-json-handler');
const RemoteStateHandler = require('../lib/remote-state-handler');

const kudaJsonHandler = new KudaJsonHandler({ fileHandler });
const packageJsonHandler = new PackageJsonHandler({ fileHandler });
const remoteStateHandler = new RemoteStateHandler({ kudaJsonHandler });

const KUDA_JSON_FILE_PATH = path.resolve(process.cwd(), 'kuda.json');

module.exports = () => {
  const exists = fileHandler.exists(KUDA_JSON_FILE_PATH);
  // if (exists) {
  //   return console.error('kuda.json file exist. Repository is already initialized!');
  // }

  return fileHandler.writeJson(KUDA_JSON_FILE_PATH, {})
    .then(() => promptNewService())
    .then(service =>
      Promise.all([
        kudaJsonHandler.writeService(service),
        packageJsonHandler.writeService(service)
      ])
    )
    .then(() => promptRemoteState())
    .then(remoteStatePath => kudaJsonHandler.writeRemoteStatePath(remoteStatePath))
    .then(() => remoteStateHandler.createEmptyState())
    .catch(console.error);
};


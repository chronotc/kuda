const fileHandler = require('../lib/file-handler');
const AddServiceCommandHandler = require('../lib/add-service-command-handler');
const RemoteStateHandler = require('../lib/remote-state-handler');

const addServiceCommandHandler = new AddServiceCommandHandler( { fileHandler });
const remoteStateHandler = new RemoteStateHandler({ fileHandler });

const path = require('path');
const { promptNewService, promptRemoteState } = require('../lib/prompts');

const PIT_JSON_FILE_PATH = path.resolve(process.cwd(), 'pit.json');

module.exports = () => {
  const exists = fileHandler.exists(PIT_JSON_FILE_PATH);
  if (exists) {
    return console.error('pit.json file exist. Repository is already initialized!');
  }

  return fileHandler.writeJson(PIT_JSON_FILE_PATH, {})
    .then(() => promptNewService())
    .then(service => addServiceCommandHandler.addService(service))
    .then(() => promptRemoteState())
    .then(remoteState => remoteStateHandler.updateRemoteStateInPitJson(remoteState))
    .catch(console.error);
};


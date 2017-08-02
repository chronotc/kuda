const path = require('path');

const { promptNewService } = require('../lib/prompts');
const fileHandler = require('../lib/file-handler');
const AddServiceCommandHandler = require('../lib/add-service-command-handler');

const addServiceCommandHandler = new AddServiceCommandHandler( { fileHandler });

const PIT_JSON_FILE_PATH = path.resolve(process.cwd(), 'pit.json');

module.exports = () => {
  const exists = fileHandler.exists(PIT_JSON_FILE_PATH);
  if (!exists) {
    return console.error(`Could not find pit.json in ${PIT_JSON_FILE_PATH}`);
  }

  return promptNewService()
    .then(service => addServiceCommandHandler.addService(service))
    .catch(console.error);
};




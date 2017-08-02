const path = require('path');

const { promptNewService } = require('../lib/prompts');
const fileHandler = require('../lib/file-handler');
const PitJsonHandler = require('../lib/pit-json-handler');
const PackageJsonHandler = require('../lib/package-json-handler');
const pitJsonHandler = new PitJsonHandler({ fileHandler });
const packageJsonHandler = new PackageJsonHandler({ fileHandler });

const PIT_JSON_FILE_PATH = path.resolve(process.cwd(), 'pit.json');

module.exports = () => {
  const exists = fileHandler.exists(PIT_JSON_FILE_PATH);
  if (!exists) {
    return console.error(`Could not find pit.json in ${PIT_JSON_FILE_PATH}`);
  }

  return promptNewService()
    .then(service =>
      Promise.all([
        pitJsonHandler.writeService(service),
        packageJsonHandler.writeService(service)
      ])
    )
    .catch(console.error);
};




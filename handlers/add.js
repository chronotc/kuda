const path = require('path');

const { promptNewService } = require('../lib/prompts');
const fileHandler = require('../lib/file-handler');
const KudaJsonHandler = require('../lib/kuda-json-handler');
const PackageJsonHandler = require('../lib/package-json-handler');
const kudaJsonHandler = new KudaJsonHandler({ fileHandler });
const packageJsonHandler = new PackageJsonHandler({ fileHandler });

const KUDA_JSON_FILE_PATH = path.resolve(process.cwd(), 'kuda.json');

module.exports = () => {
  const exists = fileHandler.exists(KUDA_JSON_FILE_PATH);
  if (!exists) {
    return console.error(`Could not find kuda.json in ${KUDA_JSON_FILE_PATH}`);
  }

  return promptNewService()
    .then(service =>
      Promise.all([
        kudaJsonHandler.writeService(service),
        packageJsonHandler.writeService(service)
      ])
    )
    .catch(console.error);
};




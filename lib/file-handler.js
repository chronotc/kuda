const Bluebird = require('bluebird');
const fs = Bluebird.promisifyAll(require('fs'));

class FileHandler {
  writeJson(filePath, json) {
    const contents = JSON.stringify(json, null, 2);
    return fs.writeFileAsync(filePath, contents);
  }

  readJson(filePath) {
    const pathExist = fs.existsSync(filePath);

    if (!pathExist) {
      throw new Error(`Could not read file from: ${filePath}`);
    }

    return fs.readFileAsync(filePath, 'utf8')
      .then(contents => JSON.parse(contents));
  }

  exists(filePath) {
    return fs.existsSync(filePath);
  }
}

module.exports = new FileHandler();
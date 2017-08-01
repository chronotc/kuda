const Bluebird = require('bluebird');
const fs = Bluebird.promisifyAll(require('fs'));
const path = require('path');

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

  verifyPackageJson(service) {
    const packageJsonPath = path.resolve(process.cwd(), service, 'package.json');
    const servicePathExist = this.exists(packageJsonPath);

    if (!servicePathExist) {
      throw new Error(`Could not find a package.json file inside service: "${service}"`);
    }

    return this.readJson(packageJsonPath)
      .then(data => this.generateInitialPitConfig(packageJsonPath, data));
  }

  generateInitialPitConfig(filePath, packageJson) {
    if (packageJson.pit) {
      return Promise.resolve(packageJson);
    }

    console.log('Writing initial pit config ...');

    const pit = {
      tasks: []
    };
    const json = Object.assign({}, packageJson, { pit });

    return this.writeJson(filePath, json);
  }
}

module.exports = new FileHandler();
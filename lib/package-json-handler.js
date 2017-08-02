const autoBind = require('auto-bind');
const { get, property } = require('lodash');
const path = require('path');

class PackageJsonHandler {
  constructor({ fileHandler }) {
    this.fileHandler = fileHandler;

    autoBind(this);
  }

  getPackageJson(service) {
    const packageJsonPath = path.resolve(process.cwd(), service, 'package.json');
    const packageJsonPathExist = this.fileHandler.exists(packageJsonPath);

    if (!packageJsonPathExist) {
      throw new Error(`Could not find a package.json file for ${service}`);
    }

    return Promise.resolve({
      filePath: packageJsonPath,
      json: this.fileHandler.readJson(packageJsonPath)
    });
  }

  writeService(service) {
    return this.getPackageJson(service)
      .then(({ filePath, json }) => {
        if (json.pit) {
          return Promise.resolve(json);
        }

        console.log('Writing initial pit config ...');

        const pit = {
          tasks: []
        };

        const updatedJson = Object.assign({}, json, { pit });

        return this.fileHandler.writeJson(filePath, updatedJson);
      });
  }

  readVersion(service) {
    return this.getPackageJson(service)
      .then(property('json.version'));
  }

  readTasks(service) {
    return this.getPackageJson(service)
      .then(property('json.pit.tasks'));
  }
}

module.exports = PackageJsonHandler;
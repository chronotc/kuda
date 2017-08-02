const autoBind = require('auto-bind');
const { property } = require('lodash');
const path = require('path');
const chalk = require('chalk');

class PackageJsonHandler {
  constructor ({ fileHandler }) {
    this.fileHandler = fileHandler;

    autoBind(this);
  }

  getPackageJson (service) {
    const packageJsonPath = path.resolve(process.cwd(), service, 'package.json');
    const packageJsonPathExist = this.fileHandler.exists(packageJsonPath);

    if (!packageJsonPathExist) {
      throw new Error(`Could not find a package.json file for ${service}`);
    }

    return this.fileHandler.readJson(packageJsonPath)
      .then(json => ({
        filePath: packageJsonPath,
        json
      }));
  }

  writeService (service) {
    return this.getPackageJson(service)
      .then(({ filePath, json }) => {
        if (json.kuda) {
          return Promise.resolve(json);
        }
        console.log(chalk.green(`Writing to ${service}/package.json ...`));
        const kuda = {
          tasks: []
        };

        const updatedJson = Object.assign({}, json, { kuda });

        return this.fileHandler.writeJson(filePath, updatedJson);
      });
  }

  readVersion (service) {
    return this.getPackageJson(service)
      .then(property('json.version'));
  }

  readTasks (service) {
    return this.getPackageJson(service)
      .then(property('json.kuda.tasks'));
  }
}

module.exports = PackageJsonHandler;

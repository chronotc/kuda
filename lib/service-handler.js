const autoBind = require('auto-bind');
const path = require('path');
const { get } = require('lodash');
const Bluebird = require('bluebird');

class ServiceHandler {
  constructor({ fileHandler, taskHandler }) {
    this.fileHandler = fileHandler;
    this.taskHandler = taskHandler;

    autoBind(this);
  }

  runTasksForService(service) {
    const packageJsonPath = path.resolve(process.cwd(), service, 'package.json');
    const packageJsonPathExist = this.fileHandler.exists(packageJsonPath);

    if (!packageJsonPathExist) {
      throw new Error(`Could not find a package.json file for ${service}`);
    }

    return this.fileHandler.readJson(packageJsonPath)
      .then(packageJsonPath => {
        const tasks = get(packageJsonPath, 'pit.tasks', []);
        const taskExecutables = tasks.map(task => () => this.taskHandler.handle(service, task));
        return Bluebird.mapSeries(taskExecutables, promise => promise());
      });
  }
}

module.exports = ServiceHandler;
const autoBind = require('auto-bind');
const path = require('path');
const { get } = require('lodash');
const Bluebird = require('bluebird');

class ServiceHandler {
  constructor({ taskHandler, remoteStateHandler, packageJsonHandler }) {
    this.taskHandler = taskHandler;
    this.remoteStateHandler = remoteStateHandler;
    this.packageJsonHandler = packageJsonHandler;

    autoBind(this);
  }

  deployService(service) {
    return this.verifyPackageVersion(service)
      .tap(() => this.runTasks(service))
      .tap(() => this.runPostDeployHook(service))
  }

  verifyPackageVersion(service) {
    return Promise.all([
        this.packageJsonHandler.readVersion(service),
        this.remoteStateHandler.readVersion(service)
      ])
      .then(([localVersion, remoteVersion]) => {
        console.log(localVersion);
        console.log(remoteVersion);
      });
  }

  runPostDeployHook(service) {
    return '';
  }

  runTasks(service) {
    return this.packageJsonHandler.getTasks(service)
      .then(tasks => {
        const taskExecutables = tasks.map(task => () => this.taskHandler.handle(service, task));
        return Bluebird.mapSeries(taskExecutables, promise => promise());
      });
  }
}

module.exports = ServiceHandler;
const autoBind = require('auto-bind');
const Bluebird = require('bluebird');
const cmp = require('semver-compare');

class ServiceHandler {
  constructor ({ taskHandler, remoteStateHandler, packageJsonHandler }) {
    this.taskHandler = taskHandler;
    this.remoteStateHandler = remoteStateHandler;
    this.packageJsonHandler = packageJsonHandler;

    autoBind(this);
  }

  deployService (service) {
    return this.isDeploymentRequired(service)
      .then(({ required, localVersion, remoteVersion }) => {
        if (!required) {
          console.log(`Deployment is not required`);
          console.log(`localVersion: ${localVersion}`);
          console.log(`remoteVersion: ${remoteVersion}`);
          return Promise.resolve('Deployment complete');
        }

        const executables = [
          () => this.runTasks(service),
          () => this.runPostDeployHook(service, localVersion)
        ];

        return Bluebird.mapSeries(executables, promise => promise());
      });
  }

  isDeploymentRequired (service) {
    return Bluebird.all([
      this.packageJsonHandler.readVersion(service),
      this.remoteStateHandler.readVersion(service)
    ])
      .then(([localVersion, remoteVersion]) => {
        if (!remoteVersion) {
          return {
            required: true,
            localVersion,
            remoteVersion
          };
        }

        console.log(remoteVersion);

        return {
          required: cmp(localVersion, remoteVersion),
          localVersion,
          remoteVersion
        };
      });
  }

  runPostDeployHook (service, latestVersion) {
    console.log(`Writing to remote state for service: ${service}, version: ${latestVersion}`);
    return this.remoteStateHandler.writeVersion(service, latestVersion);
  }

  runTasks (service) {
    return this.packageJsonHandler.readTasks(service)
      .then(tasks => {
        const taskExecutables = tasks.map(task => () => this.taskHandler.handle(service, task));
        return Bluebird.mapSeries(taskExecutables, promise => promise());
      });
  }
}

module.exports = ServiceHandler;

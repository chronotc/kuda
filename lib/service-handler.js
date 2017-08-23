const autoBind = require('auto-bind');
const Bluebird = require('bluebird');
const cmp = require('semver-compare');

class ServiceHandler {
  constructor ({ taskHandler, changeDetector }) {
    this.taskHandler = taskHandler;
    this.changeDetector = changeDetector;

    autoBind(this);
  }

  deployService (service) {
    return this.changeDetector.isDeploymentRequired(service)
      .then(required => {
        if (!required) {
          console.log('Tasks are skipped as no changes are detected');
          return Promise.resolve('Tasks skipped');
        }

        const executables = [
          () => this.taskHandler.runAllTasksForService(service),
          () => this.taskHandler.postHook(service)
        ];

        return Bluebird.mapSeries(executables, promise => promise());
      });
  }
}

module.exports = ServiceHandler;

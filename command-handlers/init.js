const autoBind = require('auto-bind');
const chalk = require('chalk');

class InitCommandHandler {
  constructor ({ kudaJsonHandler, packageJsonHandler, prompts }) {
    this.kudaJsonHandler = kudaJsonHandler;
    this.packageJsonHandler = packageJsonHandler;
    this.prompts = prompts;

    autoBind(this);
  }

  handle () {
    const exists = this.kudaJsonHandler.doesConfigFileExist();
    if (exists) {
      return this.reinitialize();
    }

    return this.initialize();
  }

  reinitialize () {
    return this.prompts.promptReinitialize()
      .then(reinitialize => {
        if (!reinitialize) {
          return null;
        }

        return this.initialize();
      });
  }

  initialize () {
    return this.kudaJsonHandler.writeEmptyFile()
      .then(() => this.prompts.promptNewService())
      .then(service => {
        return Promise.all([
          this.kudaJsonHandler.writeService(service),
          this.packageJsonHandler.writeService(service)
        ]);
      })
      .then(() => this.prompts.promptRemoteState())
      .then(remoteStatePath => this.kudaJsonHandler.writeRemoteStatePath(remoteStatePath))
      .catch(err => console.log(chalk.red(err.stack)));
  }
}

module.exports = InitCommandHandler;

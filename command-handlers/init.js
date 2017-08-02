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
    console.log(this);

    return this.kudaJsonHandler.writeEmptyFile()
      .then(() => this.prompts.promptNewService())
      .tap(() => console.log('hello'))
      .then(service => {
        console.log(this);
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

const autoBind = require('auto-bind');

class AddCommandHandler {
  constructor ({ kudaJsonHandler, packageJsonHandler, prompts }) {
    this.kudaJsonHandler = kudaJsonHandler;
    this.packageJsonHandler = packageJsonHandler;
    this.prompts = prompts;

    autoBind(this);
  }

  handle () {
    this.kudaJsonHandler.verifyConfigFile();

    return this.prompts.promptNewService()
      .then(service =>
        Promise.all([
          this.kudaJsonHandler.writeService(service),
          this.packageJsonHandler.writeService(service)
        ])
      )
      .catch(console.error);
  }
}

module.exports = AddCommandHandler;

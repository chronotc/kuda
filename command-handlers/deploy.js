const autoBind = require('auto-bind');
const Bluebird = require('bluebird');
const chalk = require('chalk');

class DeployCommandHandler {
  constructor ({ kudaJsonHandler, serviceHandler }) {
    this.kudaJsonHandler = kudaJsonHandler;
    this.serviceHandler = serviceHandler;

    autoBind(this);
  }

  handle () {
    return this.kudaJsonHandler.readAllServices()
      .then(services => {
        const serviceExecutables = services.map(service => () => this.serviceHandler.deployService(service.name));
        return Bluebird.mapSeries(serviceExecutables, promise => promise());
      })
      .catch(err => {
        console.log(chalk.red(err.stack));
        process.exit(1);
      });
  }
}

module.exports = DeployCommandHandler;

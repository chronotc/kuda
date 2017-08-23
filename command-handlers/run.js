const autoBind = require('auto-bind');
const Bluebird = require('bluebird');
const chalk = require('chalk');

class RunCommandHandler {
  constructor ({ kudaJsonHandler, serviceHandler }) {
    this.kudaJsonHandler = kudaJsonHandler;
    this.serviceHandler = serviceHandler;

    autoBind(this);
  }

  handle (options) {
    return this.kudaJsonHandler.readAllServices()
      .then(services => this.handleTarget({ target: options.s, services }))
      .then(services => {
        const serviceExecutables = services.map(service => () => this.serviceHandler.run(service.name));
        return Bluebird.mapSeries(serviceExecutables, promise => promise());
      })
      .catch(err => {
        console.log(chalk.red(err.stack));
        process.exit(1);
      });
  }

  handleTarget ({ target, services }) {
    if (!target) {
      return services;
    }

    return services.filter(({ name }) => target.toString() === name);
  }
}

module.exports = RunCommandHandler;

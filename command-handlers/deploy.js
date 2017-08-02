const autoBind = require('auto-bind');
const Bluebird = require('bluebird');

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
      });
  }
}

module.exports = DeployCommandHandler;

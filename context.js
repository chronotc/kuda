const autoBind = require('auto-bind');

const AddCommandHandler = require('./command-handlers/add');
const DeployCommandHandler = require('./command-handlers/deploy');
const InitCommandHandler = require('./command-handlers/init');
const prompts = require('./lib/prompts');

const ServiceHandler = require('./lib/service-handler');
const PackageVersionChangeDetector = require('./lib/change-detectors/package-version');

const TaskHandler = require('./lib/task-handler');

class Context {
  constructor ({ fileHandlerFactory }) {
    this.fileHandlerFactory = fileHandlerFactory;
    autoBind(this);
  }

  createAddCommandHandler () {
    return new AddCommandHandler({
      kudaJsonHandler: this.fileHandlerFactory.getHandler('kuda'),
      packageJsonHandler: this.fileHandlerFactory.getHandler('package'),
      prompts
    });
  }

  createDeployCommandHandler () {
    const packageVersionChangeDetector = new PackageVersionChangeDetector({
      remoteStateHandler: this.fileHandlerFactory.getHandler('remote'),
      packageJsonHandler: this.fileHandlerFactory.getHandler('package')
    });

    const taskHandler = new TaskHandler({
      packageJsonHandler: this.fileHandlerFactory.getHandler('package'),
      remoteStateHandler: this.fileHandlerFactory.getHandler('remote')
    });

    const serviceHandler = new ServiceHandler({
      taskHandler,
      changeDetector: packageVersionChangeDetector
    });

    return new DeployCommandHandler({
      kudaJsonHandler: this.fileHandlerFactory.getHandler('kuda'),
      serviceHandler
    });
  }

  createInitCommandHandler () {
    return new InitCommandHandler({
      kudaJsonHandler: this.fileHandlerFactory.getHandler('kuda'),
      packageJsonHandler: this.fileHandlerFactory.getHandler('package'),
      prompts
    });
  }
}

module.exports = Context;

const autoBind = require('auto-bind');
const fileHandler = require('./file-handlers/file-handler');
const KudaJsonHandler = require('./file-handlers/kuda-json-handler');
const PackageJsonHandler = require('./file-handlers/package-json-handler');
const RemoteStateHandler = require('./file-handlers/remote-state-handler');

class FileHandlerFactory {
  constructor () {
    this.handlers = {};

    autoBind(this);
  }

  init () {
    this.handlers = {
      remote: this._createRemoteStateHandler(),
      kuda: this._createKudaJsonHandler(),
      package: this._createPackageJsonHandler()
    };
  }

  getHandler (name) {
    const handler = this.handlers[name];
    if (!handler) {
      throw new Error(`Could not find handler: ${name}`);
    }
    return handler;
  }

  _createRemoteStateHandler () {
    return new RemoteStateHandler({ kudaJsonHandler: this._createKudaJsonHandler() });
  }

  _createKudaJsonHandler () {
    return new KudaJsonHandler({ fileHandler });
  }

  _createPackageJsonHandler () {
    return new PackageJsonHandler({ fileHandler });
  }
}

module.exports = new FileHandlerFactory();
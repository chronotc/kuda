const autoBind = require('auto-bind');
const Bluebird = require('bluebird');
const cmp = require('semver-compare');

class PackageVersionChangeDetector {
  constructor ({ remoteStateHandler, packageJsonHandler }) {
    this.remoteStateHandler = remoteStateHandler;
    this.packageJsonHandler = packageJsonHandler;

    autoBind(this);
  }

  isDeploymentRequired (service) {
    return Bluebird.all([
        this.packageJsonHandler.readVersion(service),
        this.remoteStateHandler.readVersion(service)
      ])
      .then(([localVersion, remoteVersion]) => {
        console.log(`service: ${service}`, `localVersion: ${localVersion}`, `remoteVersion: ${remoteVersion}`);

        if (!remoteVersion) {
          return true;
        }

        return cmp(localVersion, remoteVersion);
      });
  }
}

module.exports = PackageVersionChangeDetector;

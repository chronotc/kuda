const autoBind = require('auto-bind');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({apiVersion: '2006-03-01'});
const { property } = require('lodash');
const chalk = require('chalk');

class RemoteStateHandler {
  constructor ({ kudaJsonHandler }) {
    this.kudaJsonHandler = kudaJsonHandler;

    autoBind(this);
  }

  readVersion (service) {
    return this.getRemoteState()
      .then(property(`${service}.version`));
  }

  writeVersion (service, version) {
    return this.getRemoteState()
      .then(remoteState => {
        remoteState[service] = {
          version,
          deployed: new Date().toISOString()
        };

        return this.writeRemoteState(remoteState);
      });
  }

  getRemoteState () {
    return this.kudaJsonHandler.readRemoteStatePath()
      .then(remoteStatePath => this.getBucketAndKey(remoteStatePath))
      .then(params => s3.getObject(params).promise())
      .then(({Body}) => JSON.parse(Buffer.from(Body).toString()))
      .catch(() => this.handleGetRemoteStateError());
  }

  handleGetRemoteStateError () {
    return this.kudaJsonHandler.readRemoteStatePath()
      .then(remoteStatePath => {
        console.log(chalk.red(`Could not retreive remote state: ${remoteStatePath}`));
        console.log(chalk.green(`Creating an empty remote state: ${remoteStatePath}`));
        return this.createEmptyState();
      });
  }

  writeRemoteState (json) {
    return this.kudaJsonHandler.readRemoteStatePath()
      .then(remoteStatePath => this.getBucketAndKey(remoteStatePath))
      .then(({ Bucket, Key }) => {
        const params = {
          Body: JSON.stringify(json),
          ContentType: 'application/json',
          Bucket,
          Key,
          ServerSideEncryption: 'AES256'
        };

        return s3.putObject(params).promise();
      });
  }

  createEmptyState () {
    return this.writeRemoteState({});
  }

  getBucketAndKey (remoteStatePath) {
    const trimmed = remoteStatePath.replace(/^s3:\/\//g, '');
    const [Bucket, ...bucketPath] = trimmed.split('/');
    const Key = bucketPath.join('/');

    return {
      Bucket,
      Key
    };
  }
}

module.exports = RemoteStateHandler;

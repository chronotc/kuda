const autoBind = require('auto-bind');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({apiVersion: '2006-03-01'});
const _ = require('lodash');


class RemoteStateHandler {
  constructor({ pitJsonHandler }) {
    this.pitJsonHandler = pitJsonHandler;

    autoBind(this);
  }

  verifyService(service) {
    return this.pitJsonHandler.readRemoteStatePath()
      .then(remoteStatePath => this.getBucketAndKey(remoteStatePath))
      .then(params => s3.getObject(params).promise())
      .then(remoteState => {
        console.log(remoteState);
      });
  }

  createEmptyState() {
    return this.pitJsonHandler.readRemoteStatePath()
      .then(remoteStatePath => this.getBucketAndKey(remoteStatePath))
      .then(({ Bucket, Key }) => {
        const params = {
          Body: JSON.stringify({}),
          Bucket,
          Key,
          ServerSideEncryption: "AES256",
        };

        console.log('params', params);

        return s3.putObject(params).promise();
      });
  }

  getBucketAndKey(remoteStatePath) {
    const trimmed = remoteStatePath.replace(/^s3:\/\//g, '');
    const [Bucket, ...bucketPath] = _.split(trimmed, '/');
    const Key = bucketPath.join('/');

    return {
      Bucket,
      Key
    }
  }
}

module.exports = RemoteStateHandler;
const inquirer = require('inquirer');
const { property } = require('lodash');

function promptNewService () {
  const question = {
    type: 'input',
    name: 'service',
    message: 'What service would you like to add? (sub-folder of this repo you would like to track)'
  };

  return inquirer.prompt([question])
    .then(property('service'));
}

function promptRemoteState () {
  const question = {
    type: 'input',
    name: 's3',
    message: 'Where would you like to persist remote state? (only s3 is supported s3://<bucket>)'
  };

  return inquirer.prompt([question])
    .then(property('s3'));
}

function promptReinitialize () {
  const question = {
    type: 'confirm',
    name: 'reinitialize',
    message: 'This repository has already be initialized. Would you like to reinitialize? [WARNING: This will remove all previous settings]'
  };

  return inquirer.prompt([question])
    .then(property('reinitialize'));
}

function promptCreateRemoteState () {
  const question = {
    type: 'confirm',
    name: 'createRemoteState',
    message: 'Remote state file could not be found. Would you like to create a new remote state file?'
  };

  return inquirer.prompt([question])
    .then(property('createRemoteState'));
}

module.exports = {
  promptNewService,
  promptRemoteState,
  promptReinitialize,
  promptCreateRemoteState
};

const autoBind = require('auto-bind');
const path = require('path');
const { get } = require('lodash');
const Bluebird = require('bluebird');
const { execSync } = require('child_process');

class TaskHandler {
  constructor() {
    autoBind(this);
  }

  handle(task) {
    console.log(`Task: ${task.name} \n Command: ${task.command}`);

    return Promise.resolve(execSync(task.command));
  }
}

module.exports = new TaskHandler();
const autoBind = require('auto-bind');
const Bluebird = require('bluebird');
const cmd = require('node-cmd');
const getAsync = Bluebird.promisify(cmd.get, { multiArgs: true, context: cmd });
const commandParser = require('./command-parser');

class TaskHandler {
  constructor () {
    autoBind(this);
  }

  handle (service, task) {
    console.log(`Service: ${service}`, `Task: ${task.name}`, `Command: ${task.command}`);

    const command = commandParser.parse(service, task.command);
    return getAsync(command)
      .then(([commandOutput]) => console.log(`Output: ${commandOutput}`))
      .catch(console.error);
  }
}

module.exports = new TaskHandler();

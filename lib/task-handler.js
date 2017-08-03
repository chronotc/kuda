const autoBind = require('auto-bind');
const Bluebird = require('bluebird');
const cmd = require('node-cmd');
const getAsync = Bluebird.promisify(cmd.get, { multiArgs: true, context: cmd });
const commandParser = require('./command-parser');
const chalk = require('chalk');

class TaskHandler {
  constructor () {
    autoBind(this);
  }

  handle (service, task) {
    console.log(`Service: ${service}`, `Task: ${task.name}`, `Command: ${task.command}`);

    const command = commandParser.parse(service, task.command);
    return getAsync(command)
      .then(([commandOutput]) => console.log(chalk.yellow(`Output: ${commandOutput}`)))
      .catch(err => {
        console.log(chalk.red(err.stack));
        process.exit(1);
      });
  }
}

module.exports = new TaskHandler();

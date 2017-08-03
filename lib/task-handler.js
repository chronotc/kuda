const autoBind = require('auto-bind');
const commandParser = require('./command-parser');
const { exec } = require('child_process');

class TaskHandler {
  constructor () {
    autoBind(this);
  }

  handle (service, task) {
    console.log(`Service: ${service}`, `Task: ${task.name}`, `Command: ${task.command}`);

    const command = commandParser.parse(service, task.command);
    return new Promise((resolve) => {
      exec(command, { maxBuffer: 4000 * 1024 }, (err, stdout, stderr) => {
        if (err) {
          console.error(err);
          console.error(stdout);
          console.error(stderr);
          process.exit(1);
        }

        console.log('Output:', stdout);
        return resolve('Command completed successfully');
      });
    });
  }
}

module.exports = new TaskHandler();

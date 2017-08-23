const autoBind = require('auto-bind');
const Bluebird = require('bluebird');
const commandParser = require('./command-parser');
const { exec } = require('child_process');

class TaskHandler {
  constructor ({ packageJsonHandler, remoteStateHandler }) {
    this.packageJsonHandler = packageJsonHandler;
    this.remoteStateHandler = remoteStateHandler;

    autoBind(this);
  }

  runAllTasksForService (service) {
    return this.packageJsonHandler.readTasks(service)
      .then(tasks => {
        const taskExecutables = tasks.map(task => () => this.handle(service, task));
        return Bluebird.mapSeries(taskExecutables, promise => promise());
      });
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

  postHook (service) {
    return this.packageJsonHandler.readVersion(service)
      .then(latestVersion => {
        console.log(`Writing to remote state for service: ${service}, version: ${latestVersion}`);
        return this.remoteStateHandler.writeVersion(service, latestVersion);
      });
  }
}

module.exports = TaskHandler;

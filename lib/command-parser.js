const format = require("string-template");
const autoBind = require('auto-bind');

class CommandParser {

  constructor() {
    autoBind(this);
  }

  parse(service, command) {
    const prependedCommand = this.prependDirectory(service, command);
    return this.injectEnv(prependedCommand);
  }

  prependDirectory(service, command) {
    return `cd ${service} && ${command}`;
  }

  injectEnv(string) {
    return format(string, process.env);
  }
}

module.exports = new CommandParser();
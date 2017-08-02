const argv = require('minimist')(process.argv.slice(2));
const SUPPORTED_COMMANDS = require('./commands');

const { _ } = argv;

// console.log(process.env);

const capturedCommand = _.find(arg => !!SUPPORTED_COMMANDS[arg]);

if (!capturedCommand) {
  throw new Error('Please use one of the following commands. [ init / add / deploy ]');
}

SUPPORTED_COMMANDS[capturedCommand].handler();

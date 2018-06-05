import program from 'commander';
import context from './context';

const rootKudaFileReader = context.createRootKudaFileReader();

const list = val => val.split(',');

program
  .version('1.0.0');

program
  .command('run <env>')
  .description('run tasks for all projects which have changed')
  .option('-p, --projects <items>', 'target specific projects (comma delimited)', list)
  .action((env, options) => {
    return rootKudaFileReader.handle({ env, targetedProjects: options.projects })
    .then(console.log);
  });

program
  .command('diff <env>')
  .description('diff since last run')
  .action((env, options) => {
    // Handle run tasks and
  });

program
  .command('tag <env>')
  .description('tag to indicate tasks has been run for an environment')
  .action(env => {
    // Handle run tasks and
  });

program.parse(process.argv);

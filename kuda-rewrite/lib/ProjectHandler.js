import Bluebird from 'bluebird';
import { ChildKudaFileReader } from './ChildKudaFileReader';
import { TaskHandler } from './TaskHandler';
import includes from 'lodash.includes';

class ProjectHandler {
  constructor({ childKudaFileReader, taskHandler }) {
    this.childKudaFileReader = childKudaFileReader;
    this.taskHandler = taskHandler;
  }

  handle = runContext => {
    if (!runContext.targetedProjects) {
      return this.handleAll(runContext);
    }

    return this.handleTargeted(runContext);
  }

  handleAll = runContext => {
    console.log('handling all');
  }

  handleTargeted = runContext => {
    console.log('Handling targeted projects', runContext.targetedProjects);
    const targets = runContext.projects.filter(project => includes(runContext.targetedProjects, project.name));
    const executors = targets.map(target => () => this.handleProject({ project: { ...target }, runContext }));

    Bluebird.mapSeries(executors, (executor) => executor())
  }

  handleProject = input => {
    return this.childKudaFileReader.handle(input.project)
    .then(definition => this.taskHandler.handle({ ...input, definition }))
  }
}

export { ProjectHandler };

import { JsonFileReader } from './lib/JsonFileReader';
import { ChildKudaFileReader } from './lib/ChildKudaFileReader';
import { ProjectHandler } from './lib/ProjectHandler';
import { TaskHandler } from './lib/TaskHandler';
import RootKudaFileReader from './lib/RootKudaFileReader';

class Context {
  createRootKudaFileReader = () => {
    return new RootKudaFileReader({
      jsonFileReader: new JsonFileReader(),
      projectHandler: this.createProjectHandler()
    });
  }

  createChildKudaFileReader = () => {
    return new ChildKudaFileReader({
      jsonFileReader: new JsonFileReader()
    });
  }

  createProjectHandler = () => {
    return new ProjectHandler({
      childKudaFileReader: this.createChildKudaFileReader(),
      taskHandler: new TaskHandler()
    });
  }
}

const context = new Context();

export default context;

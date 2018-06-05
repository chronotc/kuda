import path from 'path';
import { JsonFileReader } from './JsonFileReader';
import { ProjectHandler } from './ProjectHandler';

class RootKudaFileReader {
  constructor({ jsonFileReader, projectHandler }) {
    this.jsonFileReader = jsonFileReader;
    this.projectHandler = projectHandler;
  }

  handle = input => {
    return this.read()
    .then(projects => this.projectHandler.handle({
      projects,
      env: input.env,
      targetedProjects: input.targetedProjects,
    }));
  }

  read = () => {
    const kudaPath = path.resolve(process.cwd(), 'kuda.json');
    return this.jsonFileReader.validatePath(kudaPath)
    .then(this.jsonFileReader.read)
    .catch(() => console.log('Unable to read root kuda.json file'));
  }
}

export default RootKudaFileReader;

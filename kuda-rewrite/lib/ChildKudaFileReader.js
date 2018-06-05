import path from 'path';
import { JsonFileReader } from './JsonFileReader';
class ChildKudaFileReader {
  constructor({ jsonFileReader }) {
    this.jsonFileReader = jsonFileReader;
  }

  handle = input => {
    return this.read(input);
  }

  read = input => {
    const kudaFilePath = path.resolve(process.cwd(), input.kudafile);
    return this.jsonFileReader.validatePath(kudaFilePath)
    .then(this.jsonFileReader.read)
    .catch(err => {
      console.error(err);
      console.log(`Could not read kudafile.json. Path: ${kudaFilePath}`);
    });
  }
}

export { ChildKudaFileReader };

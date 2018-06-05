import Bluebird from 'bluebird';
import fs from 'fs';
const fsAsync = Bluebird.promisifyAll(fs);

class JsonFileReader {
  read = filePath => {
    return this.validatePath(filePath)
    .then(path => fsAsync.readFileAsync(path, 'utf8'))
    .then(JSON.parse);
  }

  validatePath = filePath => {
    const pathExist = fsAsync.existsSync(filePath);
    if (!pathExist) {
      throw new Error(`Could not read file from: ${filePath}`);
    }
    return Bluebird.resolve(filePath);
  }
}

export { JsonFileReader };

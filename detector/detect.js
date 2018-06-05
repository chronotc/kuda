const execa = require('execa');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const { ENVIRONMENT } = process.env;

const BUILD_FOLDER = './dist/';
const OUTPUT_JSON_PATH = path.resolve(BUILD_FOLDER, 'output.json');

// create build folder
mkdirp.sync(BUILD_FOLDER);

const contents = fs.readFileSync('./registered.json', 'utf-8');
const registered = JSON.parse(contents);

if (!ENVIRONMENT) {
  throw new Error('ENVIRONMENT is required');
}

const mapProjectChanges = (projects) => {
  return projects.map(project =>
    getLastTag(project)
    .then(tag => Object.assign({}, { tag }, project))
    .then(hasChangesSinceDiff));
};

const getLastTag = ({ name }) => {
  return execa('git', ['describe', '--tags', '--match', `${ENVIRONMENT}-${name}-*`, '--abbrev=0'])
  .then(({ stdout }) => stdout)
  .catch(() => {
    console.log(`Could not find tag for project: ${name}`);
    return null;
  });
};

const hasChangesSinceDiff = (project) => {
  if (!project.tag) {
    return Promise.resolve(Object.assign(project, { changed: true }));
  }

  return execa('git', ['diff', '--name-only', project.tag])
  .then(({ stdout }) => stdout)
  .then(changes => {
    const arrayOfChangedFiles = changes.split('\n');
    return arrayOfChangedFiles.some(filename => filename.includes(project.path));
  });
};

const exportChanges = (projects) => {
  const triggers = projects
    .filter(project => !!project.changed)
    .map(project => ({
      trigger: project.slug
    }));

  const output = {
    env: {},
    steps: triggers
  };

  const data = JSON.stringify(output, null, 2);
  console.log(`Writing to: ${OUTPUT_JSON_PATH}`);
  fs.writeFileSync(OUTPUT_JSON_PATH, data);
};

const triggerChanges = () => {
  return execa('buildkite-agent', ['pipeline', 'upload', OUTPUT_JSON_PATH, '--debug', '--replace']);
};

Promise.all(mapProjectChanges(registered))
.then(exportChanges)
.then(triggerChanges)
.catch(err => {
  console.error(err);
  process.exit(1);
});

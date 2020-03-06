///<reference path="./node_modules/@types/node/index.d.ts" />
import * as fs from 'fs';

const pkg = require('./package.json');

const publishPackage = {
  name: pkg.name,
  version: pkg.version,
  description: pkg.description,
  files: pkg.files,
  sideEffects: pkg.sideEffects,
  repository: pkg.repository,
  keywords: pkg.keywords,
  author: pkg.author,
  license: pkg.license,
  bugs: pkg.bugs,
  homepage: pkg.homepage,
  dependencies: pkg.dependencies
};

if (!fs.existsSync('./dist')) {
  fs.mkdirSync('./dist');
}

fs.writeFileSync(
  './dist/package.json',
  JSON.stringify(publishPackage, null, 2),
  {
    encoding: 'utf-8'
  }
);

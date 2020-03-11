///<reference path="../node_modules/@types/node/index.d.ts" />
import * as fs from 'fs';
import * as path from 'path';

/**
 * Treat package.json root as root.
 */
const outDir = './dist';
const copyItems = ['README.md', 'src']; // For Sourcemaps

const pkg = require('../package.json');

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

const copyRecursiveSync = (src: string, dest: string): void => {
  const srcIsDirectory = fs.statSync(src).isDirectory();
  if (srcIsDirectory) {
    if (!fs.statSync(dest).isDirectory()) {
      fs.mkdirSync(dest);
    }
    fs.readdirSync(src).forEach(function(childItemName) {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest); // UPDATE FROM:    fs.linkSync(src, dest);
  }
};

const remapSources = (map: { sources: string[] }) => {
  const sources = map.sources.map(source =>
    source.replace(/\.\.\/src/, './src')
  );
  return {
    ...map,
    sources
  };
};

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir);
}

// Write package.json
fs.writeFileSync(
  [outDir, 'package.json'].join('/'),
  JSON.stringify(publishPackage, null, 2),
  {
    encoding: 'utf-8'
  }
);

// Copy additional items
copyItems.forEach(src => copyRecursiveSync(src, [outDir, src].join('/')));

// Modify sourcemaps
const sourceMaps = fs
  .readdirSync(outDir)
  .filter(file => file.endsWith('js.map'))
  .map(file => [outDir, file].join('/'));

sourceMaps.forEach(map => {
  const file = JSON.parse(fs.readFileSync(map, { encoding: 'utf-8' }));
  const newFile = remapSources(file);
  fs.writeFileSync(map, JSON.stringify(newFile), { encoding: 'utf-8' });
});

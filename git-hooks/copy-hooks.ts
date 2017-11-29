import * as path from 'path';
import * as rimraf from 'rimraf';

import { copyDirectory, walkDirectory } from './../helpers/fs.helpers';

const hooksSourcePaths = path.resolve(__dirname, 'hooks');

copyHooks('C:/Builds/.git')

walkDirectory('C:/GitHub', undefined, (directoryPath: string) => {
  if (path.basename(directoryPath) === '.git') {
    copyHooks(directoryPath);
  }
});

function copyHooks(gitPath: string) {
  const repoHooksPath = path.join(gitPath, 'hooks');

  rimraf.sync(repoHooksPath);
  copyDirectory(hooksSourcePaths, repoHooksPath);
}

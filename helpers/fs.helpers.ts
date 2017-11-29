import * as fs from 'fs';
import * as path from 'path';

export function walkDirectory(directoryPath: string, visitFile: (filePath: string) => void, visitDirectory?: (directoryPath: string) => void) {
  const filePaths = fs.readdirSync(directoryPath)
    .map(filePath => path.resolve(path.join(directoryPath, filePath)));

  for (const filePath of filePaths) {
    const fileStat = fs.lstatSync(filePath);

    if (fileStat.isDirectory()) {
      if (visitDirectory) {
        visitDirectory(filePath);
      }

      walkDirectory(filePath, visitFile, visitDirectory);
    } else if (visitFile) {
      visitFile(filePath);
    }
  }
}

export function copyDirectory(source: string, desination: string) {
  source = path.resolve(source);
  walkDirectory(source, filePath => {
    const desinationPath = path.resolve(desination, path.relative(source, filePath));

    ensureDirectoryExists(path.dirname(desinationPath));
    writeFile(desinationPath, readFile(filePath));
  })
}

export function readFile(filePath: string) {
  return fs.readFileSync(filePath).toString();
}

export function writeFile(filePath: string, contents: string) {
  filePath = path.normalize(filePath);

  ensureDirectoryExists(filePath);

  fs.writeFileSync(filePath, contents);
  console.log(`${filePath} written.`);
}

export function deleteFile(filePath: string) {
  filePath = path.normalize(filePath);

  fs.unlinkSync(filePath);
  console.log(`${filePath} deleted.`);
}

export function ensureDirectoryExists(filePath: string) {
  const dirname = path.dirname(filePath);

  if (!fs.existsSync(dirname) || !fs.statSync(dirname).isDirectory()) {
    ensureDirectoryExists(dirname);
    fs.mkdirSync(dirname);
  }
}

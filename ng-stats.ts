import * as fs from 'fs';
import * as path from 'path';

let componentCount = 0;
let serviceCount = 0;
let moduleCount = 0;
let pipeCount = 0;
let helperCount = 0;
let specCount = 0;
let otherTsCount = 0;

walkDirectory('.', filePath => {
  if (filePath.endsWith('.component.ts')) {
    componentCount++;
  } else if (filePath.endsWith('.service.ts')) {
    serviceCount++;
  } else if (filePath.endsWith('.module.ts')) {
    moduleCount++;
  } else if (filePath.endsWith('.pipe.ts')) {
    pipeCount++;
  } else if (filePath.endsWith('.helpers.ts')) {
    helperCount++;
  } else if (filePath.endsWith('.spec.ts')) {
    specCount++;
  } else if (filePath.endsWith('.ts')) {
    otherTsCount++;
  }
});

console.log('components:', componentCount);
console.log('services:', serviceCount);
console.log('modules:', moduleCount);
console.log('pipe:', pipeCount);
console.log('helper:', helperCount);
console.log('spec:', specCount);
console.log('other:', otherTsCount);

function walkDirectory(directoryPath: string, visitFile: (filePath: string) => void) {
  const filePaths = fs.readdirSync(directoryPath)
    .map(filePath => path.resolve(path.join(directoryPath, filePath)))
    .filter(filePath => filePath.includes('node_modules') === false);

  for (const filePath of filePaths) {
    const fileStat = fs.lstatSync(filePath);

    if (fileStat.isDirectory()) {
      walkDirectory(filePath, visitFile);
    } else {
      visitFile(filePath);
    }
  }
}
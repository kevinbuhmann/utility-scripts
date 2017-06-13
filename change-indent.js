const fs = require('fs');
const path = require('path');
const changeIndent = require('change-indent');

processDirectory(path.resolve('./'))

function processDirectory(directoryPath) {
  const filePaths = fs.readdirSync(directoryPath)
    .map(filePath => path.resolve(path.join(directoryPath, filePath)))
    .filter(filePath => filePath.includes('assets') === false)
    .filter(filePath => filePath.includes('typings') === false)
    .filter(filePath => filePath.includes('node_modules') === false);

  for (let filePath of filePaths) {
    const fileStat = fs.lstatSync(filePath);

    if (fileStat.isDirectory()) {
      processDirectory(filePath);
    } else if (filePath.endsWith('.ts')) {
      const originalCode = fs.readFileSync(filePath).toString();

      let modifiedCode = originalCode;

      modifiedCode = changeIndent(modifiedCode, 2);

      fs.writeFileSync(filePath, modifiedCode);
      console.log(`processed ${filePath}`);
    }
  }
}

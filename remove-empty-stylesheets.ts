import * as fs from 'fs';
import * as path from 'path';

processDirectory(path.resolve('./'));

function processDirectory(directoryPath: string) {
  const filePaths = fs.readdirSync(directoryPath)
    .map(filePath => path.resolve(path.join(directoryPath, filePath)))
    .filter(filePath => filePath.includes('node_modules') === false);

  for (let filePath of filePaths) {
    const fileStat = fs.lstatSync(filePath);

    if (fileStat.isDirectory()) {
      processDirectory(filePath);
    } else if (filePath.endsWith('.scss')) {
      processFile(filePath);
    }
  }
}

function processFile(filePath: string) {
  const fileContents = fs.readFileSync(filePath).toString();

  if (fileContents.trim().length === 0) {
    const tsFilePath = filePath.replace('.scss', '.ts');

    if (fs.existsSync(tsFilePath)) {
      fs.unlinkSync(filePath);

      const tsFileContents = fs.readFileSync(tsFilePath).toString();
      fs.writeFileSync(tsFilePath, tsFileContents.replace(/,\s*styleUrls: \['(.+?)'\]/, ''));
    } else {
      console.log(filePath);
    }
  }
}

import * as fs from 'fs';
import * as path from 'path';

processDirectory(path.resolve('./'));

interface Import {
  import: string;
  source: string;
  index: number;
}

function processDirectory(directoryPath: string) {
  const filePaths = fs.readdirSync(directoryPath)
    .map(filePath => path.resolve(path.join(directoryPath, filePath)))
    .filter(filePath => filePath.includes('node_modules') === false);

  for (let filePath of filePaths) {
    const fileStat = fs.lstatSync(filePath);

    if (fileStat.isDirectory()) {
      processDirectory(filePath);
    } else if (filePath.endsWith('.ts')) {
      processFile(filePath);
    }
  }
}

function processFile(filePath: string) {
  const originalCode = fs.readFileSync(filePath).toString();

  const imports = findImports(originalCode);

  if (imports.length) {
    const groupedImports = groupImports(filePath, imports);
    const modifiedCode = replaceImports(originalCode, imports, groupedImports);

    fs.writeFileSync(filePath, modifiedCode);
  }

  console.log(`processed ${filePath}`);
}

function findImports(code: string) {
  let imports: Import[] = [];

  let importMatch: RegExpExecArray;
  let importPattern = /import(?: (?:[^;])+? from)? '(.+?)';/g;
  let getNextImportMatch = () => importMatch = importPattern.exec(code);
  while (getNextImportMatch() !== null) {
    imports.push({ import: importMatch[0], source: importMatch[1], index: importMatch.index });
  }

  return imports;
}

function groupImports(filePath: string, imports: Import[]) {
  const consumedImports: Import[] = [];

  const localImports = imports.filter(i => i.source.startsWith('.'));
  consumedImports.push(...localImports);

  const moduleImports = imports
    .filter(i => !consumedImports.find(i2 => i.import === i2.import));

  const groupedImports = [moduleImports, localImports];
  const importCount = groupedImports.reduce((sum, imports) => sum + imports.length, 0);

  if (imports.length !== importCount) {
    console.log('imports', imports);
    console.log('groupedImports', groupedImports);
    throw new Error(`import count mismatch in ${filePath}`);
  }

  return groupedImports;
}

function replaceImports(code: string, imports: Import[], groupedImports: Import[][]) {
  let newImports = '';

  for (let importGroup of groupedImports) {
    if (importGroup.length) {
      newImports = `${newImports}${importGroup.map(i => i.import.trim()).join('\r\n')}\r\n\r\n`;
    }
  }

  const firstImport = imports[0];
  const lastImport = imports[imports.length - 1];

  return `${code.substr(0, firstImport.index)}${newImports}${code.substr(lastImport.index + lastImport.import.length).trim()}`.trim() + '\r\n';
}

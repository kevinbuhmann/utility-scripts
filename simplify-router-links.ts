const fs = require('fs');
const path = require('path');

processDirectory(path.resolve('./'))

function processDirectory(directoryPath: string) {
  const filePaths = fs.readdirSync(directoryPath)
    .map(filePath => path.resolve(path.join(directoryPath, filePath)))
    .filter(filePath => filePath.includes('src') === true);

  for (let filePath of filePaths) {
    const fileStat = fs.lstatSync(filePath);

    if (fileStat.isDirectory()) {
      processDirectory(filePath);
    } else if (filePath.endsWith('.html')) {
      const originalTemplate = fs.readFileSync(filePath).toString();

      let modifiedTemplate = originalTemplate;

      modifiedTemplate = simplifyRouteLinks(modifiedTemplate);

      fs.writeFileSync(filePath, modifiedTemplate);
      console.log(`processed ${filePath}`);
    }
  }
}

function simplifyRouteLinks(markup: string) {
  const routerLinkPattern = /\[routerLink\]="(\[.+\])"/g;

  return markup.replace(routerLinkPattern, (match, routerLinkStr) => {
    const routerLinkJson = routerLinkStr.replace(/'/g, '"');
    const routerLink: string[] = JSON.parse(routerLinkJson);
    return `routerLink="${routerLink.join('/')}"`;
  });
}

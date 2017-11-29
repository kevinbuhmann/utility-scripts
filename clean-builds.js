/* global require, process */

'use strict';

let fs = require('fs');
let path = require('path');
let rimraf = require('rimraf');

let workingDirectory = process.argv[2] || 'C:\\Builds';

let foldersToDelete = findFolders(workingDirectory, ['bin', 'obj']);
for (let folder of foldersToDelete) {
    console.log(`deleting ${folder}`);
    rimraf.sync(folder);
}

function findFolders(rootFolderPath, subFolderNames) {
    rootFolderPath = rootFolderPath.toLowerCase();
    subFolderNames = subFolderNames.map(subFolderName => subFolderName.toLowerCase());

    let folders = [];
    if (subFolderNames.indexOf(rootFolderPath.match(/[a-z0-9-_]+$/)[0]) !== -1) {
        folders = [rootFolderPath];
    } else {
        let subFolders = fs.readdirSync(rootFolderPath)
      .filter(file => fs.statSync(path.join(rootFolderPath, file)).isDirectory())
      .map(subFolder => subFolder.toLowerCase())
      .filter(subFolder => subFolder.indexOf('.hg') === -1)
      .filter(subFolder => subFolder.indexOf('node_modules') === -1)
      .filter(subFolder => subFolder.indexOf('clientsidecontrols') === -1)
      .filter(subFolder => subFolder.indexOf('externaldependencies') === -1)
      .map(subFolder => path.join(rootFolderPath, subFolder).toLowerCase());

        for (let i = 0; i < subFolders.length; ++i) {
            folders = folders.concat(findFolders(subFolders[i], subFolderNames));
        }
    }
    return folders;
}
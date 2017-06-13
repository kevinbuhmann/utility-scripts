/* global require, process */

'use strict';

let fs = require('fs');
let globby = require('globby');

let workingDirectory = process.argv[2] || 'C:\\Builds';

globby(['./**/*.orig'], { cwd: workingDirectory }).then(files => {
	let absolutePaths = files.map(file => file.replace(/^\./, workingDirectory).replace(/\//g, '\\'));
    for (let file of absolutePaths) {
        console.log(`deleting ${file}`);
		try {
			fs.unlinkSync(file);
		} catch (e) {
			console.log(e);
		}
    }
});
const fs = require('fs');
const path = require('path');
const pathToFolder = path.join(__dirname, 'secret-folder');
fs.readdir(pathToFolder, { withFileTypes: true }, (err, files) => {
  files.forEach((file) => {
    const pathToFile = path.join(file.path, file.name);
    fs.stat(pathToFile, (err, stats) => {
      if (stats.isFile()) {
        const fileObj = path.parse(pathToFile);
        console.log(`
        ${fileObj.name} - ${fileObj.ext.slice(1)} - ${stats.size / 1024}kb`);
      }
    });
  });
});

const fs = require('fs');
const path = require('path');

const pathToFolder = path.join(__dirname, 'styles');

const writeStream = fs.createWriteStream(
  path.join(__dirname, 'project-dist', 'bundle.css'),
);

fs.readdir(pathToFolder, { withFileTypes: true }, (err, files) => {
  files.forEach((file) => {
    const pathToFile = path.join(file.path, file.name);
    fs.stat(pathToFile, (err, stats) => {
      if (stats.isFile() && path.extname(pathToFile) === '.css') {
        fs.readFile(pathToFile, { encoding: 'utf8' }, (err, data) => {
          if (err) throw err;
          writeStream.write(data);
        });
      }
    });
  });
});

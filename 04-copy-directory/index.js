const fs = require('fs');
const path = require('path');

const copyDir = path.join(__dirname, 'files-copy');
fs.mkdir(copyDir, { recursive: true }, (err) => {
  if (err) throw err;
});

const pathToFolder = path.join(__dirname, 'files');
fs.readdir(pathToFolder, { withFileTypes: true }, (err, files) => {
  files.forEach((file) => {
    fs.copyFile(
      `${path.join(file.path, file.name)}`,
      `${path.join(copyDir, file.name)}`,
      (err) => {
        if (err) throw err;
      },
    );
  });
});

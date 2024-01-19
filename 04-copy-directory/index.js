const fs = require('fs');
const path = require('path');

const copyDir = './04-copy-directory/files-copy';
fs.mkdir(copyDir, { recursive: true }, (err) => {
  if (err) throw err;
});

const pathToFolder = './04-copy-directory/files';
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

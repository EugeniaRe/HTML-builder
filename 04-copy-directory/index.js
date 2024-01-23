const fs = require('fs');
const path = require('path');

const pathToFolder = path.join(__dirname, 'files');
const copyDir = path.join(__dirname, 'files-copy');

fs.exists(copyDir, (ex) => {
  if (ex) {
    fs.rm(copyDir, { recursive: true }, (err) => {
      if (err) throw err;
      fs.mkdir(copyDir, { recursive: true }, (err) => {
        if (err) throw err;
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
      });
    });
  } else {
    fs.mkdir(copyDir, { recursive: true }, (err) => {
      if (err) throw err;
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
    });
  }
});

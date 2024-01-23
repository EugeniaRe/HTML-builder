const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, (err) => {
  if (err) throw err;

  const projectDist = async () => {
    let templateData = await fsPromises.readFile(
      path.join(__dirname, 'template.html'),
      'utf8',
    );
    await fsPromises
      .readdir(path.join(__dirname, 'components'))
      .then((filenames) => {
        for (let filename of filenames) {
          if (path.extname(filename) === '.html') {
            fs.readFile(
              path.join(__dirname, 'components', filename),
              'utf8',
              (err, data) => {
                templateData = templateData.replaceAll(
                  `{{${path.basename(filename, '.html')}}}`,
                  data,
                );
                fs.writeFile(
                  path.join(__dirname, 'project-dist', 'index.html'),
                  templateData,
                  (err) => {
                    if (err) throw err;
                  },
                );
              },
            );
          }
        }
      });
  };

  projectDist();

  //copy files
  function copyFiles(fromPath, toPath) {
    fs.mkdir(toPath, { recursive: true }, (err) => {
      if (err) throw err;
      fs.readdir(fromPath,
        { withFileTypes: true },
        (err, files) => {
          files.forEach((file) => {
            fs.copyFile(
              `${path.join(file.path, file.name)}`,
              `${path.join(toPath, file.name)}`,
              (err) => {
                if (err) throw err;
              },
            );
          });
        },
      );
    });
  }

  function checkFolderCopyFiles(fromPath, toPath) {
    fs.exists(toPath, (ex) => {
      if (ex) {
        fs.rm(toPath, { recursive: true }, (err) => {
          if (err) throw err;
          copyFiles(fromPath, toPath);
        });
      } else {
        copyFiles(fromPath, toPath);
      }
    });
  }
  //copy fonts
  const fromFontsFolder = path.join(__dirname, 'assets', 'fonts');
  const toFontsFolder = path.join(__dirname, 'project-dist', 'assets', 'fonts');
  checkFolderCopyFiles(fromFontsFolder, toFontsFolder);

  //copy images
  const fromImgFolder = path.join(__dirname, 'assets', 'img');
  const toImgFolder = path.join(__dirname, 'project-dist', 'assets', 'img');
  checkFolderCopyFiles(fromImgFolder, toImgFolder);

  //copy svg
  const fromSvgFolder = path.join(__dirname, 'assets', 'svg');
  const toSvgFolder = path.join(__dirname, 'project-dist', 'assets', 'svg');
  checkFolderCopyFiles(fromSvgFolder, toSvgFolder);

  //create style.css file
  const writeStream = fs.createWriteStream(
    path.join(__dirname, 'project-dist', 'style.css'),
  );

  fs.readdir(
    path.join(__dirname, 'styles'),
    { withFileTypes: true },
    (err, files) => {
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
    },
  );
});

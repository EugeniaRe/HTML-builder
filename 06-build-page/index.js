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

  //copy fonts
  const fontsFolder = path.join(__dirname, 'project-dist', 'assets', 'fonts');
  fs.mkdir(fontsFolder, { recursive: true }, (err) => {
    if (err) throw err;
    fs.readdir(
      path.join(__dirname, 'assets', 'fonts'),
      { withFileTypes: true },
      (err, files) => {
        files.forEach((file) => {
          fs.copyFile(
            `${path.join(file.path, file.name)}`,
            `${path.join(fontsFolder, file.name)}`,
            (err) => {
              if (err) throw err;
            },
          );
        });
      },
    );
  });

  //copy images
  const imgFolder = path.join(__dirname, 'project-dist', 'assets', 'img');
  fs.mkdir(imgFolder, { recursive: true }, (err) => {
    if (err) throw err;
    fs.readdir(
      path.join(__dirname, 'assets', 'img'),
      { withFileTypes: true },
      (err, files) => {
        files.forEach((file) => {
          fs.copyFile(
            `${path.join(file.path, file.name)}`,
            `${path.join(imgFolder, file.name)}`,
            (err) => {
              if (err) throw err;
            },
          );
        });
      },
    );
  });

  //copy svg
  const svgFolder = path.join(__dirname, 'project-dist', 'assets', 'svg');
  fs.mkdir(svgFolder, { recursive: true }, (err) => {
    if (err) throw err;
    fs.readdir(
      path.join(__dirname, 'assets', 'svg'),
      { withFileTypes: true },
      (err, files) => {
        files.forEach((file) => {
          fs.copyFile(
            `${path.join(file.path, file.name)}`,
            `${path.join(svgFolder, file.name)}`,
            (err) => {
              if (err) throw err;
            },
          );
        });
      },
    );
  });

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

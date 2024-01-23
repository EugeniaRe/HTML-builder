const fs = require('fs');
const path = require('path');
const writeStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

const process = require('process');

process.stdout.write('Please, enter the text\n');

function byeFunc() {
  process.stdout.write('Thank you! Have a nice day!');
  process.exit();
}

process.stdin.on('data', function (data) {
  if (data.toString().toLowerCase().trim() === 'exit') {
    byeFunc();
  }
  writeStream.write(data);
});

process.on('SIGINT', byeFunc);

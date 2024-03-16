var fs = require('fs');
const os = require('os');
console.log('core in  machine',os.cpus().length)
var data = fs.readFileSync('input.txt');
console.log("Synchronous read: " + data.toString());

module.exports = data
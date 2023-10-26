"use strict";

// const fs = require('fs');
// // Create a DataTable
// const dataTable = [
//   { id: 1, name: "John", age: 30 },
//   { id: 2, name: "Jane", age: 28 },
//   { id: 3, name: "Bob", age: 35 },
//   { id: 4, name: "Jon", age: 30 },
//   { id: 4, name: "Jy", age: 28 },
//   { id: 6, name: "Bob", age: 35 },
//   { id: 7, name: "John", age: 30 },
//   { id: 8, name: "Jane", age: 28 },
//   { id: 9, name: "Bob", age: 35 },
//   { id: 10, name: "John", age: 30 },
// ];
// // Convert DataTable to JSON string
// const jsonData = JSON.stringify(dataTable);
// // Save the JSON data to a file
// fs.writeFileSync('datatable3.json', jsonData);
// console.log('Data saved to datatable3.json');
var fs = require('fs'); // Load data from the file


var dataFromFile = fs.readFileSync('datatable3.json', 'utf8'); // Parse the JSON data back into a JavaScript object (your DataTable)

var dataTable = JSON.parse(dataFromFile); // Now, you can work with the loaded DataTable

console.log('Loaded DataTable:');
dataTable.forEach(function (row) {
  console.log("ID: ".concat(row.id, ", Name: ").concat(row.name, ", Age: ").concat(row.age));
});
fs.unlink('array.js', function (err) {
  if (err) {
    console.error(err);
  } else {
    console.log('File deleted.');
  }
}); // fs.rmdir('dist', { recursive: true }, (err) => {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log('Directory and its contents deleted.');
//   }
// });
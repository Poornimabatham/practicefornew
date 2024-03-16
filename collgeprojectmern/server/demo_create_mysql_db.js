var mysql = require("mysql");

var mongo = require('mongodb');
// var con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "NodeJs",
// });

// con.connect(function (err) {
//     var sql = "INSERT INTO backend (name, address) VALUES ?";
//     var values = [
//       ['John', 'Highway 71'],
//       ['Peter', 'Lowstreet 4'],
//       ['Amy', 'Apple st 652'],
//       ['Hannah', 'Mountain 21'],
//       ['Michael', 'Valley 345'],
//       ['Sandy', 'Ocean blvd 2'],
//       ['Betty', 'Green Grass 1'],
//       ['Richard', 'Sky st 331'],
//       ['Susan', 'One way 98'],
//       ['Vicky', 'Yellow Garden 2'],
//       ['Ben', 'Park Lane 38'],
//       ['William', 'Central st 954'],
//       ['Chuck', 'Main Road 989'],
//       ['Viola', 'Sideway 1633']
//     ];
//     con.query(sql,[values], function (err, result) {
//     if (err) throw err;
//     console.log("ALTER created");
//   });
// });

// con.connect(function (err) {
//     // var sql = "SELECT * FROM  backend";
//     var sql = "SELECT name FROM  backend";

    
//     con.query(sql, function (err, result,fields) {
//     if (err) throw err;
//     console.log("backend data",fields);
//   });
// });


const { MongoClient } = require("mongodb");

// Connection URI
const uri = "mongodb://localhost:27017";

// Create a new MongoClient
const client = new MongoClient(uri);



client.connect(async (err) => {
    if (err) {
      console.error("Error connecting to MongoDB:", err);
      // Remove the return statement here
    } else {
      console.log("Connected to MongoDB successfully");
      // You can perform database operations here
    }
  });
  
  

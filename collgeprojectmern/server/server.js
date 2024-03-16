const express = require('express');
const app = express();
const router = require('./router/auth-router')
const add = require('./math')
const FileSystem = require("./File")
const findAreaOfTrianle = require("./PracticeQuestion")
app.use(express.json());

app.use("/api/auth",router);

console.log(`The sum of two number is ${add(0,5)}`)
console.log("Synchronous read: " + (FileSystem));
console.log("Synchronous read: " + findAreaOfTrianle(2,24));

// app.get('/', (req, res) => {
//     res.status(200).send('welcome to world of')
// })

// app.get('/register', (req, res) => {
//     res.status(200).send('welcome to the register page')
// })


app.listen(3000)
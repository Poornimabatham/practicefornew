const express = require('express');
const app = express();
const router = require('./router/auth-router')
app.use(express.json());

app.use("/api/auth",router);


// app.get('/', (req, res) => {
//     res.status(200).send('welcome to world of')
// })

// app.get('/register', (req, res) => {
//     res.status(200).send('welcome to the register page')
// })


app.listen(8080)
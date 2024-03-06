const express = require('express');
const app = express()

app.get('/', (req, res) => {
    res.status(200).send('welcome to world of mern')
})

app.get('/register', (req, res) => {
    res.status(200).send('welcome to the register page')
})


app.listen(8000)
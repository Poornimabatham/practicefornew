const express = require('express');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Define a simple route
app.get('/user', (req, res) => {
    const userName = req.query.name;
    const surname = req.query.surname;
    const age = req.query.age;

    res.send(`Hello, ${userName} ${surname}! You are ${age} years old.`);
});

// Catch-all route to handle undefined routes
app.use((req, res, next) => {
    res.status(404).send('Page not found');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

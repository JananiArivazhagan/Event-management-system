const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 3000;

app.use(bodyParser.json());

// MongoDB connection URL
const url = 'mongodb://localhost:27017';
const dbName = 'usersdb';

// Connect to MongoDB
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) {
        console.error('Error connecting to MongoDB:', err);
        return;
    }

    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection('users');

    // Endpoint to handle login requests
    app.post('/login', (req, res) => {
        const { name, id, dob } = req.body;

        // Query the database to check if the user exists
        collection.findOne({ name, id, dob }, (err, result) => {
            if (err) {
                console.error('Error finding user:', err);
                res.status(500).json({ success: false });
                return;
            }

            if (result) {
                // User found, login successful
                res.json({ success: true });
            } else {
                // User not found, login failed
                res.json({ success: false });
            }
        });
    });

    // Start the server
    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    });
});

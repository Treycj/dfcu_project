const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const registrationRoute = require('./register'); // Import the routes from register.js
const retrieveRouter = require('./retrieve'); //Import route from retrieve.js
const updateRouter = require('./update'); // Import the update router



const app = express();

// Middleware
app.use(bodyParser.json());

// Database connection (replace with actual MongoDB URL)
mongoose.connect('mongodb+srv://mawandatracy:X7uKLzF2aSqjeKzt@cluster0.mzy0o.mongodb.net/')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error: ', err));

// Use the registration routes
app.use('/api', registrationRoute);
app.use('/api', retrieveRouter);
app.use('/api', updateRouter); 



// Default route
app.get('/', (req, res) => {
  res.send('Welcome to DFCU HR Management API');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

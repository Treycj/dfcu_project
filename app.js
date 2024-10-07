const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const registrationRouter = require('./register'); // Import the routes from register.js
const retrieveRouter = require('./retrieve'); //Import route from retrieve.js
const updateRouter = require('./update'); // Import the update route
const loginRouter = require('./login'); //Import login route
const generateSecret = require('./generateSecret'); // Adjust the path to generateSecret.js accordingly
const performanceTracker = require('./performanceTracker'); // Path to the performance tracker file
const authenticateAdmin = require('./middleware/adminAuth'); // Import the admin middleware
require('dotenv').config();



const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());



// Database connection (replace with actual MongoDB URL)
mongoose.connect('mongodb+srv://mawandatracy:X7uKLzF2aSqjeKzt@cluster0.mzy0o.mongodb.net/')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error: ', err));


// Use the registration routes
app.use('/api', registrationRouter);
app.use('/api', retrieveRouter);
app.use('/api', updateRouter); 
app.use('/api', loginRouter);
app.use('/api', performanceTracker); // Mount the performance tracker at /api





// Default route
app.get('/', (req, res) => {
  res.send('Welcome to DFCU HR Management API');
});

// Call the function to generate the JWT secret (if needed)
generateSecret();

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

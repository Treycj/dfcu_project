const express = require('express');
const moment = require('moment');
const multer = require('multer');
const Staff = require('./models/staff'); // Assuming you have a staff model

const router = express.Router();

// Multer setup for handling file uploads (ID Photo)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper function to generate a random employee number
const generateEmployeeNumber = () => {
  return 'EMP' + Math.floor(100000 + Math.random() * 900000).toString();
};

// Staff Registration API with role
router.post('/register', upload.single('idPhoto'), async (req, res) => {
  const { surname, otherNames, dob, uniqueCode, role } = req.body;
  let idPhoto = '';

  // Mocked unique code validation
  const uniqueCodes = ['1234567890','5678902345','1264589570']; // Replace this with actual database logic
  if (!uniqueCodes.includes(uniqueCode)) {
    return res.status(400).json({
      statusCode: 400,
      message: 'Invalid unique code'
    });
  }

  // Validate required fields
  if (!surname || !otherNames || !dob || !moment(dob, moment.ISO_8601, true).isValid()) {
    return res.status(400).json({
      statusCode: 400,
      message: 'Invalid input: All fields are required, and date must be in ISO 8601 format'
    });
  }

  // Handle optional ID photo (Base64-encoded)
  if (req.file) {
    idPhoto = req.file.buffer.toString('base64');
  }

  // Generate employee number
  const employeeNumber = generateEmployeeNumber();

  // Validate role (default to "user" if not provided)
  const validRoles = ['user', 'admin'];
  const userRole = validRoles.includes(role) ? role : 'user'; // Default to "user" if invalid role

  // Store the new staff in the database
  const newStaff = new Staff({
    surname,
    otherNames,
    dob,
    idPhoto,
    employeeNumber,
    uniqueCode,
    role: userRole // Save role
  });

  try {
    await newStaff.save();

    // Return 201 Created with success message and status code
    return res.status(201).json({
      statusCode: 201,
      message: 'Registration successful',
      employeeNumber,
      role: userRole // Return the assigned role
    });
  } catch (error) {
    // Return 500 Internal Server Error with error message and status code
    return res.status(500).json({
      statusCode: 500,
      message: 'Error during registration',
      error: error.message
    });
  }
});

module.exports = router;

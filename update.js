const express = require('express');
const Staff = require('./models/staff'); 
const authenticateToken = require('./middleware/auth'); // Import middleware
const checkSessionTimeout = require('./middleware/sessionTimeout'); // Import the session timeout middleware



const router = express.Router();

// Staff Update API
router.put('/update', authenticateToken, checkSessionTimeout, async (req, res) => {
  const { employeeNumber, dob, idPhoto } = req.body;

  // Validate input parameters
  if (!employeeNumber) {
    return res.status(400).json({
      statusCode: 400,
      message: 'Employee number is required'
    });
  }

  try {
    // Find the staff member by employee number
    const staff = await Staff.findOne({ employeeNumber });

    if (!staff) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Staff member not found'
      });
    }

    // Update Date of Birth if provided
    if (dob) {
      staff.dob = dob;
    }

    // Update ID Photo if provided
    if (idPhoto) {
      staff.idPhoto = idPhoto; // Assuming idPhoto is in Base64 format
    }

    // Save the updated staff member
    await staff.save();

    // Return success response
    return res.status(200).json({
      statusCode: 200,
      message: 'Staff member updated successfully',
      staff
    });
  } catch (error) {
    // Return 500 Internal Server Error with error message and status code
    return res.status(500).json({
      statusCode: 500,
      message: 'Error updating staff member',
      error: error.message
    });
  }
});

module.exports = router;

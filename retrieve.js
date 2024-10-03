const express = require('express');
const Staff = require('./models/staff'); // Assuming the Staff model is defined for the staff schema
const authenticateToken = require('./middleware/auth'); // Import middleware
const checkSessionTimeout = require('./middleware/sessionTimeout'); // Import the session timeout middleware



const router = express.Router();

// Staff Retrieval API
router.get('/retrieve', authenticateToken,  checkSessionTimeout, async (req, res) => {
  const { employeeNumber } = req.query;

  try {
    // Check if an employeeNumber is provided
    if (employeeNumber) {
      // Find staff by employee number
      const staff = await Staff.findOne({ employeeNumber });

      if (!staff) {
        return res.status(404).json({
          statusCode: 404,
          message: 'Staff member not found'
        });
      }

      // Return the staff member's details
      return res.status(200).json({
        statusCode: 200,
        message: 'Success',
        staff
      });
    } else {
      // If no employeeNumber is provided, return all staff members
      const allStaff = await Staff.find({});

      if (allStaff.length === 0) {
        return res.status(404).json({
          statusCode: 404,
          message: 'No staff members found'
        });
      }

      // Return the list of all staff members
      return res.status(200).json({
        statusCode: 200,
        message: 'Success',
        staff: allStaff
      });
    }
  } catch (error) {
    // Return 500 Internal Server Error with error message and status code
    return res.status(500).json({
      statusCode: 500,
      message: 'Error retrieving staff members',
      error: error.message
    });
  }
});

module.exports = router;

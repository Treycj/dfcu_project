const express = require('express');
const jwt = require('jsonwebtoken');
const Staff = require('./models/staff'); 
const authenticateToken = require('./middleware/auth');

const router = express.Router();

// Login API
router.post('/login', async (req, res) => {
  const { surname, employeeNumber } = req.body;

  // Validate the input
  if (!surname || !employeeNumber) {
    return res.status(400).json({ message: 'Surname and employee number are required', code: 400 });
  }

  try {
    // Find staff in the database by surname and employeeNumber
    const staff = await Staff.findOne({ surname, employeeNumber });

    if (!staff) {
      return res.status(401).json({ message: 'Invalid credentials', code: 401 });
    }

    // Check if the role exists in the staff document
    const role = staff.role ? staff.role : 'user'; // Default to 'user' if no role is set

    // Generate JWT Token (access token) for staff with a 1-hour expiration
    const accessToken = jwt.sign(
      {
        id: staff._id,
        name: staff.surname,
        employeeNumber: staff.employeeNumber,
        role: role // Include the role in the token payload
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Store login time (either in the database or a memory store)
    staff.lastLoginTime = Date.now();
    await staff.save();

    // Respond with token and message
    res.status(200).json({
      message: 'Login successful',
      accessToken,
      code: 200
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', code: 500 });
  }
});

module.exports = router;

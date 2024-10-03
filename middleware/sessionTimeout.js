const Staff = require('../models/staff'); // Assuming your Staff model is in models/Staff

// Middleware to check session timeout
async function checkSessionTimeout(req, res, next) {
  const staffId = req.user.id; // User ID from the decoded JWT (authenticateToken sets this)
  
  try {
    const staff = await Staff.findById(staffId);

    if (!staff) return res.status(401).json({ message: 'User not found', code: 401 });

    const now = Date.now();
    const maxSessionDuration = 1 * 60 * 60 * 1000; // 1 hour in milliseconds
    const maxInactivityDuration = 60 * 60 * 1000; // 60 minutes inactivity duration

    // Check if the session has expired since login
    if (now - staff.lastLoginTime > maxSessionDuration) {
      return res.status(401).json({ message: 'Session expired, please login to continue', code: 401 });
    }

    // Check if the user has been inactive for too long
    if (now - staff.lastActivityTime > maxInactivityDuration) {
      return res.status(401).json({ message: 'Session expired due to inactivity, please login to continue', code: 401 });
    }

    // Update last activity time and continue
    staff.lastActivityTime = now;
    await staff.save();

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', code: 500 });
  }
}

module.exports = checkSessionTimeout;

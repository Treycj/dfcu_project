const jwt = require('jsonwebtoken');

// Function to check if the user is an admin based on the token
const isValidAdminToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    return decoded.role === 'admin'; // Check if the role is admin
  } catch (error) {
    return false; // Invalid token
  }
};

// Middleware to authenticate admin
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  if (isValidAdminToken(token)) {
    next(); // Proceed if the token is valid and belongs to an admin
  } else {
    return res.status(403).json({ message: 'Access Denied: Admins only' });
  }
};

module.exports = authenticateAdmin;

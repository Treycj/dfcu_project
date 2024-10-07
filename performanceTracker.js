const express = require('express');
const authenticateAdmin = require('./middleware/adminAuth'); // Admin authentication middleware

const router = express.Router();

// Mock data for performance tracking
let apiPerformance = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0
};

// Middleware to track API requests (applies to all routes)
router.use((req, res, next) => {
  apiPerformance.totalRequests += 1;

  // Capture the response status and increment counters accordingly
  const originalSend = res.send;
  res.send = function (body) {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      // 2xx Success responses
      apiPerformance.successfulRequests += 1;
    } else if (res.statusCode >= 400 && res.statusCode < 600) {
      // 4xx and 5xx Error responses
      apiPerformance.failedRequests += 1;
    }
    return originalSend.apply(this, arguments);
  };
  
  next();
});

// Admin-only route for viewing API performance
router.get('/admin/performance', authenticateAdmin, (req, res) => {
  res.status(200).json({
    statusCode: 200,
    message: 'API performance metrics',
    data: apiPerformance
  });
});

// Example successful request route
router.get('/success', (req, res) => {
  res.status(200).json({
    statusCode: 200,
    message: 'Request successful'
  });
});

// Example failed request route
router.get('/failure', (req, res) => {
  res.status(500).json({
    statusCode: 500,
    message: 'Request failed'
  });
});

module.exports = router;

const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

function generateSecret() {
  // Generate a random 64-byte hex string for JWT secret
  const secret = crypto.randomBytes(64).toString('hex');

  // Define the path to your .env file
  const envPath = path.join(__dirname, '.env');

  // Read the .env file (if it exists) to check if the JWT_SECRET is already set
  let envContent = '';
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  // Check if JWT_SECRET already exists in the .env file
  if (!envContent.includes('JWT_SECRET')) {
    // Append the JWT_SECRET to the .env file
    const newEnvContent = envContent + `\nJWT_SECRET=${secret}\n`;
    fs.writeFileSync(envPath, newEnvContent, 'utf8');
    console.log('JWT_SECRET has been generated and added to the .env file.');
  } else {
    console.log('JWT_SECRET already exists in the .env file.');
  }
}

// Export the function so it can be used in other files
module.exports = generateSecret;

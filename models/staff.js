const mongoose = require('mongoose');

// Define the staff schema
const staffSchema = new mongoose.Schema({
  surname: { type: String, required: true },
  otherNames: { type: String, required: true },
  dob: { type: String, required: true },
  idPhoto: { type: String }, // Base64 string
  employeeNumber: { type: String, unique: true, required: true },
  uniqueCode: { type: String, required: true },
  role: { type: String, default: 'user' }, // Role field, defaulting to 'user'

});

const Staff = mongoose.model('Staff', staffSchema);

module.exports = Staff;

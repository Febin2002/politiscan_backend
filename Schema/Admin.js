const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  emailAddress: { type: String, required: true },
  constituency: { type: String, required: true }, 
  verificationId: { type: String, required: true },
  address: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  dateOfBirth: { type: Date, required: true },
  password: { type: String, required: true }, 
  image: { type: String } 
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
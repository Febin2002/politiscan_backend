const mongoose = require('mongoose');

const voterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  email: { type: String, required: true },
  govIdType: { type: String, enum:['Aadhaar','Voter_id','Driving_license'],required: true },
  govId: { type: String, required: true },
  constituency: { type: String, required: true },
  address: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  dateOfBirth: { type: Date, required: true },
  password: { type: String, required: true },
  image: { type: String }
});

const Voter = mongoose.model('Voter', voterSchema);

module.exports = Voter;

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['intern','admin'], default: 'intern' }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);

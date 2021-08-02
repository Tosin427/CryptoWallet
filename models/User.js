const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  bitcoinAddress: {
    key: { type: String, required: true },
    address: { type: String, required: true }
  },
  bitAdd: {
    type: String,
    required: true
  },
  bitKey: {
    type: String,
    required: true
  },
  // bitcoinBalance: {
  //   status: { type: String, required: true },
  //   service: { type: String, required: true },
  //   address: { type: String, required: true },
  //   asset: { type: String, required: true },
  //   quantity: { type: String, required: true }
  // },
  bitcoinQr: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('user', UserSchema);

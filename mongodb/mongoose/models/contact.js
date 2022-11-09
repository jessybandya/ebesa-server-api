const Mongoose = require('mongoose');
const { Schema } = Mongoose;

// Contact Schema
const ContactSchema = new Schema({
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String
  },
  message: {
    type: String,
    trim: true
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  }
});

ContactModel = Mongoose.model('Contact', ContactSchema);

module.exports = ContactModel
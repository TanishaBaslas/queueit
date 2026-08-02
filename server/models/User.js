const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,

  email: { 
    type: String, 
    required: true, 
    unique: true 
  },

  role: { 
    type: String, 
    enum: ['user', 'admin', 'superadmin'], 
    default: 'user' 
  },

  history: [{
    queueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Queue'
    },
    tokenNumber: Number,
    status: String,
    servedAt: Date
  }]
});

module.exports = mongoose.model('User', userSchema);
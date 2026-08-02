const mongoose = require("mongoose");

const userQueueSchema = new mongoose.Schema({
  userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: false,
  default: null
},

  tokenNumber: {
    type: Number,
    required: true
  },

  joinedAt: {
    type: Date,
    default: Date.now
  },

  status: {
    type: String,
    enum: ["waiting", "served", "skipped"],
    default: "waiting"
  },

  notified: {
    type: Boolean,
    default: false
  }
});


const queueSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  venueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Venue",
    required: true
  },

  isActive: {
    type: Boolean,
    default: true
  },

  averageServiceTime: {
    type: Number,
    default: 120
  },

 
  nowServing: {
    type: Number,
    default: 0
  },

  
  lastToken: {
    type: Number,
    default: 0
  },

  
  queue: [
    userQueueSchema
  ]

},
{
  timestamps: true
});


module.exports = mongoose.model("Queue", queueSchema);
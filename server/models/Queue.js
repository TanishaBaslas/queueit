const mongoose = require('mongoose');

const userQueueSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tokenNumber: Number,
  joinedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['waiting', 'served', 'skipped'], default: 'waiting' },
  notified: { type: Boolean, default: false }
});

const queueSchema = new mongoose.Schema({
  name: String,
  venueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue' },
  isActive: { type: Boolean, default: true },
  averageServiceTime: { type: Number, default: 120 }, // seconds
  nowServing: { type: Number, default: 0 },
  lastToken: { type: Number, default: 0 }, // token counter, atomic increment ke liye
  queue: [userQueueSchema]
});

module.exports = mongoose.model('Queue', queueSchema);
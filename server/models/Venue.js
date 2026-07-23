const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
  name: String,
  location: String,
  queues: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Queue' }]
});

module.exports = mongoose.model('Venue', venueSchema);
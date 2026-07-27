const express = require('express');
const router = express.Router();
const Queue = require('../models/Queue');
const { verifyToken, isAdmin } = require('../middleware/auth');

// SERVE next person in queue
router.patch('/queues/:id/serve', verifyToken, isAdmin, async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);
    if (!queue) return res.status(404).json({ message: 'Queue not found' });

    // Find current serving person and mark as served
    const currentUser = queue.queue.find(
      q => q.tokenNumber === queue.nowServing && q.status === 'waiting'
    );
    if (currentUser) currentUser.status = 'served';

    // Find next waiting person
    const nextUser = queue.queue
      .filter(q => q.status === 'waiting')
      .sort((a, b) => a.tokenNumber - b.tokenNumber)[0];

    queue.nowServing = nextUser ? nextUser.tokenNumber : queue.nowServing + 1;

    await queue.save();
    res.json({ message: 'Serving next', nowServing: queue.nowServing });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SKIP current person
router.patch('/queues/:id/skip', verifyToken, isAdmin, async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);
    if (!queue) return res.status(404).json({ message: 'Queue not found' });

    const currentUser = queue.queue.find(
      q => q.tokenNumber === queue.nowServing && q.status === 'waiting'
    );
    if (currentUser) currentUser.status = 'skipped';

    const nextUser = queue.queue
      .filter(q => q.status === 'waiting')
      .sort((a, b) => a.tokenNumber - b.tokenNumber)[0];

    queue.nowServing = nextUser ? nextUser.tokenNumber : queue.nowServing + 1;

    await queue.save();
    res.json({ message: 'Skipped, moved to next', nowServing: queue.nowServing });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PAUSE / RESUME queue
router.patch('/queues/:id/pause', verifyToken, isAdmin, async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);
    if (!queue) return res.status(404).json({ message: 'Queue not found' });

    queue.isActive = !queue.isActive; // toggle
    await queue.save();

    res.json({ message: queue.isActive ? 'Queue resumed' : 'Queue paused', isActive: queue.isActive });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// WALK-IN — admin manually adds a user
router.post('/queues/:id/walkin', verifyToken, isAdmin, async (req, res) => {
  try {
    const queue = await Queue.findByIdAndUpdate(
      req.params.id,
      { $inc: { lastToken: 1 } },
      { new: true }
    );
    if (!queue) return res.status(404).json({ message: 'Queue not found' });

    const newEntry = {
      userId: null, // walk-in, no registered user
      tokenNumber: queue.lastToken,
      status: 'waiting'
    };

    queue.queue.push(newEntry);
    await queue.save();

    res.json({ message: 'Walk-in added', tokenNumber: newEntry.tokenNumber });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
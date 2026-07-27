const express = require('express');
const router = express.Router();
const Queue = require('../models/Queue');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/queue/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id);
    if (!queue) return res.status(404).json({ message: 'Queue not found' });

    const servedEntries = queue.queue.filter(q => q.status === 'served');
    const skippedEntries = queue.queue.filter(q => q.status === 'skipped');
    const waitingEntries = queue.queue.filter(q => q.status === 'waiting');

    // Average wait time = averageServiceTime * average position at join time
    // Simplified: total served * averageServiceTime gives rough total serving time
    const avgWaitTime = queue.averageServiceTime; // seconds (base estimate)

    // Peak hours — group joinedAt by hour of day
    const hourCounts = {};
    queue.queue.forEach(entry => {
      const hour = new Date(entry.joinedAt).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    // Find peak hour (hour with most joins)
    let peakHour = null;
    let maxCount = 0;
    for (const hour in hourCounts) {
      if (hourCounts[hour] > maxCount) {
        maxCount = hourCounts[hour];
        peakHour = hour;
      }
    }

    res.json({
      queueName: queue.name,
      totalJoined: queue.queue.length,
      servedCount: servedEntries.length,
      skippedCount: skippedEntries.length,
      waitingCount: waitingEntries.length,
      avgServiceTimeSeconds: avgWaitTime,
      peakHour: peakHour !== null ? `${peakHour}:00 - ${peakHour}:59` : 'No data yet',
      hourlyBreakdown: hourCounts,
      nowServing: queue.nowServing,
      isActive: queue.isActive
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
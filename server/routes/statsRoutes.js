const express = require('express');
const router = express.Router();
const Queue = require('../models/Queue');
const { verifyToken, isAdmin } = require('../middleware/auth');


 router.get('/queue/:id', verifyToken, async (req, res) => { 
  try {
    const queue = await Queue.findById(req.params.id);
    if (!queue) return res.status(404).json({ message: 'Queue not found' });

    const servedEntries = queue.queue.filter(q => q.status === 'served');
    const skippedEntries = queue.queue.filter(q => q.status === 'skipped');
    const waitingEntries = queue.queue.filter(q => q.status === 'waiting');

    
    const avgWaitTime = queue.averageServiceTime; 

    
    const hourCounts = {};
    queue.queue.forEach(entry => {
      const hour = new Date(entry.joinedAt).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    
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

router.get('/top-skipped', async (req, res) => {
  try {

    const Queue = require('../models/Queue');

    const result = await Queue.aggregate([
      {
        $unwind: "$queue"
      },
      {
        $match: {
          "queue.status": "skipped"
        }
      },
      {
        $group: {
          _id: "$queue.tokenNumber",
          skippedCount: {
            $sum: 1
          }
        }
      },
      {
        $sort: {
          skippedCount: -1
        }
      },
      {
        $limit: 3
      }
    ]);


    res.json(result);


  } catch(err) {

    res.status(500).json({
      error: err.message
    });

  }
});
module.exports = router;
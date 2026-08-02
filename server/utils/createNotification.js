const Notification = require("../models/Notification");

async function createNotification(userId, queueId, type, message) {

  if (!userId) return;

  await Notification.create({
    userId,
    queueId,
    type,
    message
  });

}

module.exports = createNotification;
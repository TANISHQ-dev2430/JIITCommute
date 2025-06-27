const admin = require('firebase-admin');
const User = require('../models/user.model');


async function sendPushNotification(userId, notification) {
  const user = await User.findById(userId);
  if (!user || !user.fcmToken) return;
  try {
    await admin.messaging().send({
      token: user.fcmToken,
      data: {
        title: notification.title || '',
        body: notification.body || '',
        ...notification.data
      }
    });
  } catch (err) {
    console.error('FCM send error:', err);
  }
}

module.exports = { sendPushNotification };

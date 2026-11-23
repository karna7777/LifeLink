const Notification = require('../models/Notification');
const User = require('../models/User');
const { sendPush } = require('./push');

// Save an in-app notification AND send a push to the user's device.
// Used everywhere the app needs to alert a user (status change, chat, broadcast, expiry).
async function notifyUser(userId, { title, body, type, data }) {
  await Notification.create({ userId, title, body, type, data });
  const user = await User.findById(userId).select('pushToken');
  if (user && user.pushToken) await sendPush(user.pushToken, title, body, data);
}

module.exports = { notifyUser };

const { Expo } = require('expo-server-sdk');

const expo = new Expo();

// Send an Expo push notification to one device token.
// Does nothing if the token is missing or not a valid Expo token.
async function sendPush(pushToken, title, body, data = {}) {
  if (!pushToken || !Expo.isExpoPushToken(pushToken)) return;
  try {
    await expo.sendPushNotificationsAsync([{ to: pushToken, sound: 'default', title, body, data }]);
  } catch (err) {
    console.error('[push] error:', err.message);
  }
}

module.exports = { sendPush };

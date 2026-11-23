const mongoose = require('mongoose');

// An in-app notification saved for a user (also sent as a push notification).
const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: String,
    body: String,
    type: { type: String, enum: ['request', 'message', 'expiry', 'broadcast'] },
    data: Object, // extra info, e.g. { requestId }
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);

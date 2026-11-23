const Notification = require('../models/Notification');

// GET /api/notifications — the logged-in user's notifications, newest first.
exports.myNotifications = async (req, res) => {
  const items = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(items);
};

// PUT /api/notifications/:id/read — mark one as read.
exports.markRead = async (req, res) => {
  const item = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { read: true },
    { new: true }
  );
  if (!item) return res.status(404).json({ message: 'Notification not found' });
  res.json(item);
};

const User = require('../models/User');

// GET /api/users/me — the logged-in user (auth middleware already loaded it).
exports.getMe = async (req, res) => {
  res.json(req.user);
};

// PUT /api/users/me — update profile + donor fields + location.
exports.updateMe = async (req, res) => {
  try {
    // Only allow these fields to be changed (never role or password here).
    const allowed = ['name', 'phone', 'bloodGroup', 'isDonor', 'isAvailable', 'lastDonationDate', 'location'];
    const updates = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/users/push-token — save the Expo push token (used in Phase 8).
exports.savePushToken = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { pushToken: req.body.pushToken });
    res.json({ message: 'Push token saved' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const User = require('../models/User');
const Facility = require('../models/Facility');
const { distanceKm } = require('../utils/distance');
const { notifyUser } = require('../utils/notify');

// POST /api/broadcast  (staff) { bloodGroup, radiusKm, message }
// Alert available donors with a matching blood group within the radius of the facility.
exports.broadcast = async (req, res) => {
  try {
    const { bloodGroup, radiusKm, message } = req.body;
    if (!bloodGroup || !message) {
      return res.status(400).json({ message: 'Blood group and message are required' });
    }

    const facility = await Facility.findById(req.user.facilityId);
    if (!facility || !facility.location || facility.location.lat == null) {
      return res.status(400).json({ message: 'Set your facility location first' });
    }

    // Donors who are available and have the matching blood group.
    const donors = await User.find({ role: 'user', isDonor: true, isAvailable: true, bloodGroup });

    const radius = Number(radiusKm) || 10;
    let notified = 0;
    for (const donor of donors) {
      const loc = donor.location;
      if (!loc || loc.lat == null) continue; // skip donors with no location
      const dist = distanceKm(facility.location.lat, facility.location.lng, loc.lat, loc.lng);
      if (dist > radius) continue;

      await notifyUser(donor._id, {
        title: `Urgent: ${bloodGroup} blood needed`,
        body: message,
        type: 'broadcast',
        data: { facilityId: String(facility._id) },
      });
      notified += 1;
    }

    res.json({ notified });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

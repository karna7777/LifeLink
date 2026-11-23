const Inventory = require('../models/Inventory');
const { distanceKm } = require('../utils/distance');

// GET /api/search?type=blood&bloodGroup=B+&lat=&lng=
// GET /api/search?type=medicine&name=paracetamol&lat=&lng=
// Returns VERIFIED facilities that have the item in stock (>0) and not expired,
// each with a combined available quantity, sorted by distance from the user.
exports.search = async (req, res) => {
  try {
    const { type, bloodGroup, name, lat, lng } = req.query;
    if (type !== 'blood' && type !== 'medicine') {
      return res.status(400).json({ message: 'type must be blood or medicine' });
    }

    const now = new Date();
    // In stock and not expired (no expiry date counts as not expired).
    const filter = {
      itemType: type,
      quantity: { $gt: 0 },
      $or: [{ expiryDate: { $gt: now } }, { expiryDate: null }],
    };
    if (type === 'blood') {
      if (!bloodGroup) return res.status(400).json({ message: 'bloodGroup is required' });
      filter.bloodGroup = bloodGroup;
    } else {
      if (!name) return res.status(400).json({ message: 'name is required' });
      filter.name = { $regex: name, $options: 'i' }; // case-insensitive contains
    }

    // Pull matching items and their facility, keep only verified facilities.
    const items = await Inventory.find(filter).populate('facilityId');

    // Combine available quantity per facility.
    const byFacility = new Map();
    for (const it of items) {
      const f = it.facilityId;
      if (!f || !f.verified) continue;
      const key = String(f._id);
      if (!byFacility.has(key)) byFacility.set(key, { facility: f, available: 0, unit: it.unit });
      byFacility.get(key).available += it.quantity;
    }

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const hasUserLoc = !Number.isNaN(userLat) && !Number.isNaN(userLng);

    let results = Array.from(byFacility.values()).map(({ facility, available, unit }) => {
      const loc = facility.location || {};
      const canMeasure = hasUserLoc && loc.lat != null && loc.lng != null;
      const dist = canMeasure ? distanceKm(userLat, userLng, loc.lat, loc.lng) : null;
      return {
        _id: facility._id,
        name: facility.name,
        type: facility.type,
        phone: facility.phone,
        address: facility.address,
        location: facility.location,
        available,
        unit,
        distanceKm: dist == null ? null : Math.round(dist * 10) / 10,
      };
    });

    // Nearest first; facilities with no distance go last.
    results.sort((a, b) => {
      if (a.distanceKm == null) return 1;
      if (b.distanceKm == null) return -1;
      return a.distanceKm - b.distanceKm;
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

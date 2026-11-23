const Facility = require('../models/Facility');
const User = require('../models/User');

// POST /api/facilities — a staff member creates their one facility.
exports.createFacility = async (req, res) => {
  try {
    // A staff member owns exactly one facility.
    if (req.user.facilityId) {
      return res.status(400).json({ message: 'You already have a facility' });
    }
    const { name, type, address, phone, location } = req.body;
    if (!name || !type) {
      return res.status(400).json({ message: 'Facility name and type are required' });
    }

    const facility = await Facility.create({ name, type, address, phone, location, createdBy: req.user._id });
    // Link the facility back to the staff user so the app knows setup is done.
    await User.findByIdAndUpdate(req.user._id, { facilityId: facility._id });

    res.status(201).json(facility);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/facilities/:id — facility details (inventory is attached in Phase 4).
exports.getFacility = async (req, res) => {
  try {
    const facility = await Facility.findById(req.params.id);
    if (!facility) return res.status(404).json({ message: 'Facility not found' });
    res.json(facility);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/facilities/:id — only the owner staff can update their facility.
exports.updateFacility = async (req, res) => {
  try {
    const facility = await Facility.findById(req.params.id);
    if (!facility) return res.status(404).json({ message: 'Facility not found' });
    if (String(facility.createdBy) !== String(req.user._id)) {
      return res.status(403).json({ message: 'You can only edit your own facility' });
    }

    const allowed = ['name', 'type', 'address', 'phone', 'location'];
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) facility[key] = req.body[key];
    });
    await facility.save();

    res.json(facility);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

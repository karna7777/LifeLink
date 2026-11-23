const User = require('../models/User');
const Facility = require('../models/Facility');
const Request = require('../models/Request');

// GET /api/admin/facilities — every facility (newest first) for the admin to review.
exports.listFacilities = async (req, res) => {
  try {
    const facilities = await Facility.find().sort({ createdAt: -1 });
    res.json(facilities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/admin/facilities/:id/verify — set verified true/false.
exports.verifyFacility = async (req, res) => {
  try {
    const facility = await Facility.findByIdAndUpdate(
      req.params.id,
      { verified: !!req.body.verified },
      { new: true }
    );
    if (!facility) return res.status(404).json({ message: 'Facility not found' });
    res.json(facility);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/stats — simple counts for the admin dashboard.
exports.stats = async (req, res) => {
  try {
    const [totalUsers, totalFacilities, verifiedFacilities, totalRequests] = await Promise.all([
      User.countDocuments(),
      Facility.countDocuments(),
      Facility.countDocuments({ verified: true }),
      Request.countDocuments(),
    ]);
    res.json({ totalUsers, totalFacilities, verifiedFacilities, totalRequests });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

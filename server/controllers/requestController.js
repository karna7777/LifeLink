const Request = require('../models/Request');

// POST /api/requests  (user) — create a request, with an optional prescription image.
exports.createRequest = async (req, res) => {
  try {
    const { facilityId, itemType, bloodGroup, component, medicineName, quantity, urgency, note } = req.body;
    if (!facilityId || !itemType || !quantity) {
      return res.status(400).json({ message: 'Facility, item type and quantity are required' });
    }
    if (Number(quantity) <= 0) {
      return res.status(400).json({ message: 'Quantity must be greater than 0' });
    }

    // multer put the uploaded file (if any) on req.file.
    const prescriptionUrl = req.file ? '/uploads/' + req.file.filename : undefined;

    const request = await Request.create({
      userId: req.user._id,
      facilityId,
      itemType,
      bloodGroup,
      component,
      medicineName,
      quantity,
      urgency: urgency || 'normal',
      note,
      prescriptionUrl,
      status: 'pending',
      statusHistory: [{ status: 'pending', by: req.user._id }],
    });

    // Notify the facility's staff in real time about the new request.
    req.app.get('io').to('facility:' + facilityId).emit('request:new', request);

    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/requests/mine  (user) — the logged-in user's own requests.
exports.myRequests = async (req, res) => {
  const requests = await Request.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(requests);
};

// GET /api/requests/incoming  (staff) — requests sent to the staff's facility.
exports.incoming = async (req, res) => {
  if (!req.user.facilityId) return res.status(400).json({ message: 'Create your facility first' });
  const requests = await Request.find({ facilityId: req.user.facilityId })
    .sort({ createdAt: -1 })
    .populate('userId', 'name phone bloodGroup');
  res.json(requests);
};

// GET /api/requests/:id — the request owner or the facility's staff can view it.
exports.getRequest = async (req, res) => {
  const request = await Request.findById(req.params.id).populate('userId', 'name phone');
  if (!request) return res.status(404).json({ message: 'Request not found' });

  const isOwner = String(request.userId._id) === String(req.user._id);
  const isStaff = req.user.facilityId && String(request.facilityId) === String(req.user.facilityId);
  if (!isOwner && !isStaff) return res.status(403).json({ message: 'Not allowed' });

  res.json(request);
};

// PUT /api/requests/:id/status — staff approve/reject/fulfil, user cancel (while pending).
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const isOwner = String(request.userId) === String(req.user._id);
    const isStaff = req.user.facilityId && String(request.facilityId) === String(req.user.facilityId);

    if (['approved', 'rejected', 'fulfilled'].includes(status)) {
      if (!isStaff) return res.status(403).json({ message: 'Only facility staff can do this' });
    } else if (status === 'cancelled') {
      if (!isOwner) return res.status(403).json({ message: 'Only the requester can cancel' });
      if (request.status !== 'pending') return res.status(400).json({ message: 'Only a pending request can be cancelled' });
    } else {
      return res.status(400).json({ message: 'Invalid status' });
    }

    request.status = status;
    request.statusHistory.push({ status, by: req.user._id });
    await request.save();

    // Push the status change to the requester and anyone viewing this request.
    const io = req.app.get('io');
    io.to('user:' + request.userId).emit('request:status', { requestId: request._id, status });
    io.to('request:' + request._id).emit('request:status', { requestId: request._id, status });

    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

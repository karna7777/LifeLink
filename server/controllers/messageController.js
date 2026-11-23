const Message = require('../models/Message');
const Request = require('../models/Request');

// Only the request's owner or the facility's staff may read/write its chat.
function canAccess(request, user) {
  const isOwner = String(request.userId) === String(user._id);
  const isStaff = user.facilityId && String(request.facilityId) === String(user.facilityId);
  return isOwner || isStaff;
}

// GET /api/messages/:requestId — chat history for a request.
exports.getMessages = async (req, res) => {
  try {
    const request = await Request.findById(req.params.requestId);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (!canAccess(request, req.user)) return res.status(403).json({ message: 'Not allowed' });

    const messages = await Message.find({ requestId: req.params.requestId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/messages/:requestId — send a message (optional image).
exports.sendMessage = async (req, res) => {
  try {
    const request = await Request.findById(req.params.requestId);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (!canAccess(request, req.user)) return res.status(403).json({ message: 'Not allowed' });

    const imageUrl = req.file ? '/uploads/' + req.file.filename : undefined;
    const text = req.body.text;
    if (!text && !imageUrl) return res.status(400).json({ message: 'Message cannot be empty' });

    const message = await Message.create({ requestId: req.params.requestId, senderId: req.user._id, text, imageUrl });

    // Push the new message to everyone currently viewing this request.
    req.app.get('io').to('request:' + req.params.requestId).emit('message:new', message);

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

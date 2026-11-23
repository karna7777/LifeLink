const mongoose = require('mongoose');

// A chat message on a request, between the patient and the facility staff.
const messageSchema = new mongoose.Schema(
  {
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: String,
    imageUrl: String, // optional image attached to the message
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);

const mongoose = require('mongoose');

// One entry in a request's status history (who changed it to what, and when).
const statusEntrySchema = new mongoose.Schema(
  {
    status: String,
    at: { type: Date, default: Date.now },
    by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { _id: false }
);

// A patient's request to a facility for blood or medicine.
const requestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    facilityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Facility', required: true },

    itemType: { type: String, enum: ['blood', 'medicine'], required: true },
    bloodGroup: String, // for blood
    component: String, // for blood
    medicineName: String, // for medicine
    quantity: { type: Number, required: true, min: 1 },

    urgency: { type: String, enum: ['normal', 'urgent', 'critical'], default: 'normal' },
    note: String,
    prescriptionUrl: String, // path to uploaded prescription image, if any

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'fulfilled', 'cancelled'],
      default: 'pending',
    },
    statusHistory: [statusEntrySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Request', requestSchema);

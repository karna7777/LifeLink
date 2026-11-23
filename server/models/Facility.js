const mongoose = require('mongoose');

// A hospital, blood bank, or pharmacy. Created by staff, verified by an admin
// before it shows up in user search.
const facilitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ['hospital', 'blood_bank', 'pharmacy'], required: true },
    address: String,
    phone: String,
    location: { lat: Number, lng: Number }, // captured via expo-location in Phase 5
    verified: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Facility', facilitySchema);

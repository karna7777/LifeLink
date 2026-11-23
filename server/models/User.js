const mongoose = require('mongoose');

// A user is a patient/donor, facility staff, or an admin.
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true }, // stored hashed, never plain
    phone: String,
    role: { type: String, enum: ['user', 'staff', 'admin'], default: 'user' },

    // Donor profile (only meaningful for role 'user').
    bloodGroup: String,
    isDonor: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: false },
    lastDonationDate: Date,

    location: { lat: Number, lng: Number },

    // Set in Phase 3 when a staff member creates their facility.
    facilityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Facility' },

    pushToken: String, // Expo push token, saved in Phase 8
  },
  { timestamps: true } // adds createdAt + updatedAt automatically
);

module.exports = mongoose.model('User', userSchema);

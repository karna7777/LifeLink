const mongoose = require('mongoose');

// One stock item at a facility — either a blood component or a medicine.
const inventorySchema = new mongoose.Schema(
  {
    facilityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Facility', required: true },
    itemType: { type: String, enum: ['blood', 'medicine'], required: true },

    // For blood items:
    bloodGroup: String, // A+, A-, B+, ...
    component: String, // Whole Blood, Plasma, Platelets, RBC

    // For medicine items:
    name: String,

    quantity: { type: Number, required: true, min: 0 },
    unit: { type: String, enum: ['units', 'strips', 'bottles'], default: 'units' },
    batchNo: String,
    expiryDate: Date,
  },
  { timestamps: true } // createdAt + updatedAt
);

module.exports = mongoose.model('Inventory', inventorySchema);

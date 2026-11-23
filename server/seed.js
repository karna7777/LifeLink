// Fills the database with sample data for demos and the viva.
// Run with:  npm run seed   (this RESETS the sample collections first, then inserts fresh data.)
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Facility = require('./models/Facility');
const Inventory = require('./models/Inventory');
const Request = require('./models/Request');
const Message = require('./models/Message');
const Notification = require('./models/Notification');

// Small helper: a date N days from now (negative = in the past).
const days = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
};

async function seed() {
  if (!process.env.MONGO_URI) throw new Error('Set MONGO_URI in server/.env first');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected. Clearing old data…');

  // Reset the collections so the seed is repeatable.
  await Promise.all([
    User.deleteMany({}),
    Facility.deleteMany({}),
    Inventory.deleteMany({}),
    Request.deleteMany({}),
    Message.deleteMany({}),
    Notification.deleteMany({}),
  ]);

  const hash = (pw) => bcrypt.hash(pw, 10);

  // --- Users ---
  const admin = await User.create({ name: 'Admin', email: 'admin@lifelink.app', password: await hash('admin123'), role: 'admin' });

  const staff1 = await User.create({ name: 'City Hospital Staff', email: 'staff@lifelink.app', password: await hash('staff123'), role: 'staff' });
  const staff2 = await User.create({ name: 'Red Cross Staff', email: 'bloodbank@lifelink.app', password: await hash('staff123'), role: 'staff' });
  const staff3 = await User.create({ name: 'Apollo Staff', email: 'pharmacy@lifelink.app', password: await hash('staff123'), role: 'staff' });

  const user1 = await User.create({ name: 'Rahul Donor', email: 'user@lifelink.app', password: await hash('user123'), role: 'user', bloodGroup: 'B+', isDonor: true, isAvailable: true, location: { lat: 12.9716, lng: 77.5946 } });
  await User.create({ name: 'Asha Donor', email: 'donor2@lifelink.app', password: await hash('user123'), role: 'user', bloodGroup: 'O-', isDonor: true, isAvailable: true, location: { lat: 12.98, lng: 77.6 } });

  // --- Facilities (each owned by a staff user) ---
  const cityHospital = await Facility.create({ name: 'City Hospital', type: 'hospital', address: 'MG Road, Bengaluru', phone: '+91 98765 43210', location: { lat: 12.9716, lng: 77.5946 }, verified: true, createdBy: staff1._id });
  const redCross = await Facility.create({ name: 'Red Cross Blood Bank', type: 'blood_bank', address: 'Residency Road, Bengaluru', phone: '+91 98765 11111', location: { lat: 12.965, lng: 77.6 }, verified: true, createdBy: staff2._id });
  // Apollo is left UNVERIFIED on purpose, so you can verify it while logged in as admin.
  const apollo = await Facility.create({ name: 'Apollo Pharmacy', type: 'pharmacy', address: 'Indiranagar, Bengaluru', phone: '+91 98765 22222', location: { lat: 12.978, lng: 77.64 }, verified: false, createdBy: staff3._id });

  // Link each facility back to its staff owner.
  await User.findByIdAndUpdate(staff1._id, { facilityId: cityHospital._id });
  await User.findByIdAndUpdate(staff2._id, { facilityId: redCross._id });
  await User.findByIdAndUpdate(staff3._id, { facilityId: apollo._id });

  // --- Inventory (mix of expiry states so the badges show green/orange/red) ---
  await Inventory.create([
    { facilityId: cityHospital._id, itemType: 'blood', bloodGroup: 'B+', component: 'Whole Blood', quantity: 12, unit: 'units', batchNo: 'CH-B1', expiryDate: days(40) },
    { facilityId: cityHospital._id, itemType: 'blood', bloodGroup: 'O-', component: 'Plasma', quantity: 4, unit: 'units', batchNo: 'CH-O1', expiryDate: days(5) }, // expiring soon
    { facilityId: cityHospital._id, itemType: 'medicine', name: 'Paracetamol', quantity: 50, unit: 'strips', batchNo: 'CH-M1', expiryDate: days(300) },
    { facilityId: cityHospital._id, itemType: 'medicine', name: 'Insulin', quantity: 3, unit: 'bottles', batchNo: 'CH-M2', expiryDate: days(-2) }, // expired + low stock
    { facilityId: redCross._id, itemType: 'blood', bloodGroup: 'A+', component: 'Whole Blood', quantity: 8, unit: 'units', batchNo: 'RC-A1', expiryDate: days(20) },
    { facilityId: redCross._id, itemType: 'blood', bloodGroup: 'O+', component: 'RBC', quantity: 10, unit: 'units', batchNo: 'RC-O1', expiryDate: days(15) },
  ]);

  // --- One pending request (user1 -> City Hospital) so staff has something to approve ---
  await Request.create({
    userId: user1._id,
    facilityId: cityHospital._id,
    itemType: 'blood',
    bloodGroup: 'B+',
    component: 'Whole Blood',
    quantity: 2,
    urgency: 'urgent',
    note: 'Needed for surgery',
    status: 'pending',
    statusHistory: [{ status: 'pending', by: user1._id }],
  });

  console.log('\n✅ Seed complete. Demo logins:');
  console.log('  Admin : admin@lifelink.app     / admin123');
  console.log('  Staff : staff@lifelink.app     / staff123   (City Hospital, verified)');
  console.log('  Staff : bloodbank@lifelink.app / staff123   (Red Cross, verified)');
  console.log('  Staff : pharmacy@lifelink.app  / staff123   (Apollo, UNVERIFIED — verify it as admin)');
  console.log('  User  : user@lifelink.app      / user123    (B+ donor)');
  console.log('  User  : donor2@lifelink.app    / user123    (O- donor)');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

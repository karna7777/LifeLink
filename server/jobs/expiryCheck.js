const cron = require('node-cron');
const Inventory = require('../models/Inventory');
const User = require('../models/User');
const { notifyUser } = require('../utils/notify');

// Finds items that are expired or expiring within 7 days, then notifies each
// facility's staff (saves a Notification + sends a push).
async function runExpiryCheck() {
  const now = new Date();
  const soon = new Date();
  soon.setDate(now.getDate() + 7);

  const items = await Inventory.find({ expiryDate: { $lte: soon } });
  const expired = items.filter((i) => i.expiryDate && i.expiryDate < now).length;
  const expiringSoon = items.length - expired;

  console.log(`[expiry] ${expired} expired, ${expiringSoon} expiring within 7 days`);

  // Notify each facility's staff about their expiring/expired items.
  const countByFacility = {};
  for (const it of items) {
    const key = String(it.facilityId);
    countByFacility[key] = (countByFacility[key] || 0) + 1;
  }
  for (const facilityId of Object.keys(countByFacility)) {
    const staff = await User.find({ facilityId, role: 'staff' }).select('_id');
    for (const s of staff) {
      await notifyUser(s._id, { title: 'Items expiring', body: `${countByFacility[facilityId]} item(s) expired or expiring soon.`, type: 'expiry', data: {} });
    }
  }

  return { expired, expiringSoon };
}

// Schedule the check to run once a day at 08:00 server time.
function startExpiryJob() {
  cron.schedule('0 8 * * *', () => {
    runExpiryCheck().catch((err) => console.error('[expiry] job error:', err.message));
  });
  console.log('⏰ Daily expiry check scheduled (08:00)');
}

module.exports = { startExpiryJob, runExpiryCheck };

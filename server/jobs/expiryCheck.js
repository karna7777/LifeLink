const cron = require('node-cron');
const Inventory = require('../models/Inventory');

// Finds items that are expired or expiring within 7 days.
// In Phase 8 this also sends Expo push notifications + saves Notification docs for staff.
async function runExpiryCheck() {
  const now = new Date();
  const soon = new Date();
  soon.setDate(now.getDate() + 7);

  const items = await Inventory.find({ expiryDate: { $lte: soon } });
  const expired = items.filter((i) => i.expiryDate && i.expiryDate < now).length;
  const expiringSoon = items.length - expired;

  console.log(`[expiry] ${expired} expired, ${expiringSoon} expiring within 7 days`);
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

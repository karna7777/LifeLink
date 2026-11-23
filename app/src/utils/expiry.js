// Decide an expiry badge from an expiry date.
// green = OK, orange = expires within 7 days, red = expired.
// Shared by ExpiryBadge and the staff dashboard counts.
export function getExpiryStatus(expiryDate) {
  if (!expiryDate) return { level: 'ok', label: 'OK' };
  const now = new Date();
  const exp = new Date(expiryDate);
  const days = Math.ceil((exp - now) / (1000 * 60 * 60 * 24)); // days until expiry
  if (days < 0) return { level: 'expired', label: 'Expired' };
  if (days <= 7) return { level: 'soon', label: `${days}d left` };
  return { level: 'ok', label: 'OK' };
}

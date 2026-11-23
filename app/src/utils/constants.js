// App-wide constants in one place so the theme and option lists are easy to change.
// Primary colour is a blood/health red (#D32F2F).

export const COLORS = {
  primary: '#D32F2F', // blood/health red
  primaryDark: '#B71C1C',
  primaryLight: '#FFCDD2',
  background: '#FFFFFF',
  surface: '#F5F5F5',
  card: '#FFFFFF',
  text: '#212121',
  textMuted: '#757575',
  border: '#E0E0E0',
  white: '#FFFFFF',

  // expiry / status colours
  green: '#2E7D32', // OK
  orange: '#F57C00', // expiring soon
  red: '#D32F2F', // expired / critical
};

// The eight valid blood groups.
export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// Blood component types stored in inventory.
export const BLOOD_COMPONENTS = ['Whole Blood', 'Plasma', 'Platelets', 'RBC'];

// Facility categories.
export const FACILITY_TYPES = ['hospital', 'blood_bank', 'pharmacy'];

// How urgent a request is.
export const URGENCY_LEVELS = ['normal', 'urgent', 'critical'];

// The lifecycle a request moves through.
export const REQUEST_STATUS = ['pending', 'approved', 'rejected', 'fulfilled', 'cancelled'];

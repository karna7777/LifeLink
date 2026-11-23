import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import { COLORS, FACILITY_TYPES } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { getCurrentLocation } from '../../services/location';

// Create (first time) or edit the staff member's facility.
// Shown full-screen when staff has no facility yet, and as the staff "Profile" tab after.
export default function FacilitySetupScreen() {
  const { user, logout, updateUser } = useAuth();
  const hasFacility = !!user?.facilityId;

  const [loading, setLoading] = useState(hasFacility);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('hospital');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [verified, setVerified] = useState(false);
  const [location, setLocation] = useState(null); // { lat, lng } — used so the facility shows up in search

  useEffect(() => {
    if (!hasFacility) return;
    (async () => {
      try {
        const { data } = await api.get('/facilities/' + user.facilityId);
        setName(data.name || '');
        setType(data.type || 'hospital');
        setAddress(data.address || '');
        setPhone(data.phone || '');
        setVerified(data.verified);
        setLocation(data.location || null);
      } catch (err) {
        Alert.alert('Error', 'Could not load your facility.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function captureLocation() {
    const loc = await getCurrentLocation();
    if (!loc) return Alert.alert('Location', 'Permission denied or location unavailable.');
    setLocation(loc);
  }

  async function save() {
    if (!name) return Alert.alert('Missing info', 'Facility name is required.');
    setSaving(true);
    try {
      const body = { name, type, address, phone, location: location || undefined };
      if (hasFacility) {
        const { data } = await api.put('/facilities/' + user.facilityId, body);
        setVerified(data.verified);
        Alert.alert('Saved', 'Facility updated.');
      } else {
        await api.post('/facilities', body);
        const { data } = await api.get('/users/me'); // refresh so facilityId is set
        await updateUser(data);
        Alert.alert('Created', 'Facility created. Waiting for admin verification.');
      }
    } catch (err) {
      Alert.alert('Could not save', err.response?.data?.message || 'Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Loader text="Loading facility…" />;

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.title}>{hasFacility ? 'My facility' : 'Set up your facility'}</Text>
      {hasFacility && (
        <Text style={[styles.badge, { color: verified ? COLORS.green : COLORS.orange }]}>
          {verified ? '✓ Verified' : '⏳ Pending admin verification'}
        </Text>
      )}

      <Input label="Facility name" value={name} onChangeText={setName} placeholder="e.g. City Hospital" />

      <Text style={styles.label}>Type</Text>
      <View style={styles.row}>
        {FACILITY_TYPES.map((t) => (
          <TouchableOpacity key={t} style={[styles.chip, type === t && styles.chipActive]} onPress={() => setType(t)}>
            <Text style={[styles.chipText, type === t && styles.chipTextActive]}>{t.replace('_', ' ')}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Input label="Address" value={address} onChangeText={setAddress} placeholder="Full address" multiline />
      <Input label="Phone" value={phone} onChangeText={setPhone} placeholder="Contact number" keyboardType="phone-pad" />

      <TouchableOpacity style={styles.locBtn} onPress={captureLocation}>
        <Text style={styles.locText}>
          📍 {location ? `Location set (${location.lat.toFixed(4)}, ${location.lng.toFixed(4)})` : 'Use my current location'}
        </Text>
      </TouchableOpacity>

      <Button title={hasFacility ? 'Save changes' : 'Create facility'} loading={saving} style={{ marginTop: 10 }} onPress={save} />
      <Button title="Logout" variant="outline" style={{ marginTop: 10 }} onPress={logout} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 20, backgroundColor: COLORS.background },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  badge: { fontWeight: '700', marginTop: 6, marginBottom: 20 },
  label: { fontSize: 13, color: COLORS.textMuted, marginBottom: 8, marginTop: 6, fontWeight: '600' },
  row: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  chip: { flex: 1, borderWidth: 1, borderColor: COLORS.primary, borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  chipActive: { backgroundColor: COLORS.primary },
  chipText: { color: COLORS.primary, fontWeight: '700', textTransform: 'capitalize' },
  chipTextActive: { color: COLORS.white },
  locBtn: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12, alignItems: 'center', marginTop: 4 },
  locText: { color: COLORS.text, fontWeight: '600' },
});

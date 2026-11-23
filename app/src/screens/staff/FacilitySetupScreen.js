import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { COLORS, FACILITY_TYPES } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';

// Staff facility details. Doubles as the staff "Profile" tab.
// Creating/updating a facility (and admin verification) is wired up in Phase 3.
export default function FacilitySetupScreen() {
  const { logout } = useAuth();
  const [name, setName] = useState('City Hospital');
  const [type, setType] = useState('hospital');
  const [address, setAddress] = useState('MG Road, Bengaluru');
  const [phone, setPhone] = useState('+91 98765 43210');

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.title}>My facility</Text>
      <Text style={styles.badge}>⏳ Pending admin verification</Text>

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

      <Button title="Save facility" style={{ marginTop: 10 }} onPress={() => {}} />
      <Button title="Logout" variant="outline" style={{ marginTop: 10 }} onPress={logout} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 20, backgroundColor: COLORS.background },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  badge: { color: COLORS.orange, fontWeight: '700', marginTop: 6, marginBottom: 20 },
  label: { fontSize: 13, color: COLORS.textMuted, marginBottom: 8, fontWeight: '600' },
  row: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  chip: { flex: 1, borderWidth: 1, borderColor: COLORS.primary, borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  chipActive: { backgroundColor: COLORS.primary },
  chipText: { color: COLORS.primary, fontWeight: '700', textTransform: 'capitalize' },
  chipTextActive: { color: COLORS.white },
});

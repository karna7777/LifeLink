import { useState } from 'react';
import { View, Text, ScrollView, Switch, Alert, StyleSheet } from 'react-native';
import Card from '../../components/Card';
import Button from '../../components/Button';
import BloodGroupPicker from '../../components/BloodGroupPicker';
import { COLORS } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';
import { getCurrentLocation } from '../../services/location';
import api from '../../services/api';

// User profile: shows real user, edits blood group + donor toggles + location, saves to the server.
export default function ProfileScreen() {
  const { user, logout, updateUser } = useAuth();
  const [bloodGroup, setBloodGroup] = useState(user?.bloodGroup || null);
  const [isDonor, setIsDonor] = useState(user?.isDonor || false);
  const [isAvailable, setIsAvailable] = useState(user?.isAvailable || false);
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);

  async function save() {
    setSaving(true);
    try {
      const { data } = await api.put('/users/me', { bloodGroup, isDonor, isAvailable });
      await updateUser(data);
      Alert.alert('Saved', 'Your profile has been updated.');
    } catch (err) {
      Alert.alert('Could not save', err.response?.data?.message || 'Please try again.');
    } finally {
      setSaving(false);
    }
  }

  // Capture current location and save it — used for donor alerts in later phases.
  async function updateLocation() {
    setLocating(true);
    try {
      const loc = await getCurrentLocation();
      if (!loc) return Alert.alert('Location', 'Permission denied or location unavailable.');
      const { data } = await api.put('/users/me', { location: loc });
      await updateUser(data);
      Alert.alert('Saved', 'Your location has been updated.');
    } catch (err) {
      Alert.alert('Could not save', err.response?.data?.message || 'Please try again.');
    } finally {
      setLocating(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.name}>{user?.name}</Text>
      <Text style={styles.muted}>{user?.email}</Text>

      <Text style={styles.section}>Blood group</Text>
      <BloodGroupPicker value={bloodGroup} onChange={setBloodGroup} />

      <Card style={{ marginTop: 20 }}>
        <View style={styles.rowBetween}>
          <Text style={styles.rowLabel}>I am a donor</Text>
          <Switch value={isDonor} onValueChange={setIsDonor} trackColor={{ true: COLORS.primaryLight }} thumbColor={isDonor ? COLORS.primary : '#ccc'} />
        </View>
        <View style={[styles.rowBetween, { marginTop: 12 }]}>
          <Text style={styles.rowLabel}>Available to donate now</Text>
          <Switch value={isAvailable} onValueChange={setIsAvailable} trackColor={{ true: COLORS.primaryLight }} thumbColor={isAvailable ? COLORS.primary : '#ccc'} />
        </View>
      </Card>

      <Button title="Save profile" loading={saving} style={{ marginTop: 16 }} onPress={save} />
      <Button title="Update my location" variant="outline" loading={locating} style={{ marginTop: 10 }} onPress={updateLocation} />
      <Button title="Logout" variant="outline" style={{ marginTop: 10 }} onPress={logout} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 20, backgroundColor: COLORS.background },
  name: { fontSize: 24, fontWeight: '800', color: COLORS.text },
  muted: { color: COLORS.textMuted, marginTop: 4 },
  section: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginTop: 24, marginBottom: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowLabel: { fontSize: 15, color: COLORS.text },
});

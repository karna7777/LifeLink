import { useState } from 'react';
import { View, Text, ScrollView, Switch, StyleSheet } from 'react-native';
import Card from '../../components/Card';
import Button from '../../components/Button';
import BloodGroupPicker from '../../components/BloodGroupPicker';
import { COLORS } from '../../utils/constants';
import { useDevAuth } from '../../navigation/RootNavigator';

// User profile: blood group, donor toggles, location, logout.
// Editing/saving is wired up in Phase 2.
export default function ProfileScreen() {
  const { setRole } = useDevAuth();
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [isDonor, setIsDonor] = useState(true);
  const [isAvailable, setIsAvailable] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.name}>Demo User</Text>
      <Text style={styles.muted}>demo@lifelink.app</Text>

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

      <Button title="Update my location" variant="outline" style={{ marginTop: 16 }} onPress={() => {}} />
      <Button title="Logout" style={{ marginTop: 10 }} onPress={() => setRole(null)} />
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

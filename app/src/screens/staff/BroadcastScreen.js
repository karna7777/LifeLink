import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Input from '../../components/Input';
import Button from '../../components/Button';
import BloodGroupPicker from '../../components/BloodGroupPicker';
import { COLORS } from '../../utils/constants';

// Staff broadcasts an urgent need to nearby matching donors.
// Sending push notifications to donors is wired up in Phase 8.
export default function BroadcastScreen() {
  const [bloodGroup, setBloodGroup] = useState(null);
  const [radius, setRadius] = useState('10');
  const [message, setMessage] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.title}>Urgent donor broadcast</Text>
      <Text style={styles.muted}>Alert available donors with a matching blood group nearby.</Text>

      <Text style={styles.label}>Blood group needed</Text>
      <BloodGroupPicker value={bloodGroup} onChange={setBloodGroup} />

      <Input label="Radius (km)" value={radius} onChangeText={setRadius} placeholder="10" keyboardType="number-pad" style={{ marginTop: 16 }} />
      <Input label="Message" value={message} onChangeText={setMessage} placeholder="e.g. Need B+ blood urgently" multiline />

      <Button title="Send broadcast" style={{ marginTop: 10 }} onPress={() => {}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 20, backgroundColor: COLORS.background },
  title: { fontSize: 20, fontWeight: '800', color: COLORS.text },
  muted: { color: COLORS.textMuted, marginTop: 6, marginBottom: 20 },
  label: { fontSize: 13, color: COLORS.textMuted, marginBottom: 8, fontWeight: '600' },
});

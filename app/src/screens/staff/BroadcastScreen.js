import { useState } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';
import Input from '../../components/Input';
import Button from '../../components/Button';
import BloodGroupPicker from '../../components/BloodGroupPicker';
import { COLORS } from '../../utils/constants';
import api from '../../services/api';

// Staff send an urgent alert to nearby available donors with a matching blood group.
export default function BroadcastScreen() {
  const [bloodGroup, setBloodGroup] = useState(null);
  const [radius, setRadius] = useState('10');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  async function send() {
    if (!bloodGroup) return Alert.alert('Blood group', 'Select the blood group needed.');
    if (!message.trim()) return Alert.alert('Message', 'Enter a message.');
    setSending(true);
    try {
      const { data } = await api.post('/broadcast', { bloodGroup, radiusKm: Number(radius) || 10, message: message.trim() });
      Alert.alert('Broadcast sent', `Notified ${data.notified} donor(s).`);
      setMessage('');
    } catch (err) {
      Alert.alert('Could not send', err.response?.data?.message || 'Please try again.');
    } finally {
      setSending(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.title}>Urgent donor broadcast</Text>
      <Text style={styles.muted}>Alert available donors with a matching blood group nearby.</Text>

      <Text style={styles.label}>Blood group needed</Text>
      <BloodGroupPicker value={bloodGroup} onChange={setBloodGroup} />

      <Input label="Radius (km)" value={radius} onChangeText={setRadius} placeholder="10" keyboardType="number-pad" style={{ marginTop: 16 }} />
      <Input label="Message" value={message} onChangeText={setMessage} placeholder="e.g. Need B+ blood urgently" multiline />

      <Button title="Send broadcast" loading={sending} style={{ marginTop: 10 }} onPress={send} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 20, backgroundColor: COLORS.background },
  title: { fontSize: 20, fontWeight: '800', color: COLORS.text },
  muted: { color: COLORS.textMuted, marginTop: 6, marginBottom: 20 },
  label: { fontSize: 13, color: COLORS.textMuted, marginBottom: 8, fontWeight: '600' },
});

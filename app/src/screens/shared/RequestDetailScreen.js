import { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import StatusBadge from '../../components/StatusBadge';
import { COLORS } from '../../utils/constants';

// Request detail: status timeline + chat thread.
// Real status history + live chat (Socket.io) arrive in Phases 6 & 7.
const TIMELINE = [
  { status: 'pending', at: '10:02 AM' },
  { status: 'approved', at: '10:15 AM' },
];
const DUMMY_MESSAGES = [
  { id: '1', mine: false, text: 'We have 2 units ready for pickup.' },
  { id: '2', mine: true, text: 'Great, coming in 20 minutes.' },
];

export default function RequestDetailScreen({ route }) {
  const title = route.params?.title || 'Request';
  const [draft, setDraft] = useState('');

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.wrap}>
        <Text style={styles.title}>{title}</Text>

        <Text style={styles.section}>Status</Text>
        {TIMELINE.map((t, i) => (
          <View key={i} style={styles.timelineRow}>
            <StatusBadge status={t.status} />
            <Text style={styles.muted}>{t.at}</Text>
          </View>
        ))}

        <Text style={styles.section}>Chat</Text>
        {DUMMY_MESSAGES.map((m) => (
          <View key={m.id} style={[styles.bubble, m.mine ? styles.mine : styles.theirs]}>
            <Text style={m.mine ? styles.mineText : styles.theirsText}>{m.text}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputBar}>
        <TextInput style={styles.input} value={draft} onChangeText={setDraft} placeholder="Type a message" placeholderTextColor={COLORS.textMuted} />
        <TouchableOpacity style={styles.send} onPress={() => setDraft('')}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  wrap: { padding: 20 },
  title: { fontSize: 20, fontWeight: '800', color: COLORS.text },
  section: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginTop: 24, marginBottom: 12 },
  timelineRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  muted: { color: COLORS.textMuted },
  bubble: { maxWidth: '80%', padding: 12, borderRadius: 14, marginBottom: 8 },
  mine: { backgroundColor: COLORS.primary, alignSelf: 'flex-end' },
  theirs: { backgroundColor: COLORS.surface, alignSelf: 'flex-start' },
  mineText: { color: COLORS.white },
  theirsText: { color: COLORS.text },
  inputBar: { flexDirection: 'row', padding: 12, borderTopWidth: 1, borderColor: COLORS.border, gap: 8, alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, color: COLORS.text },
  send: { backgroundColor: COLORS.primary, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20 },
  sendText: { color: COLORS.white, fontWeight: '700' },
});

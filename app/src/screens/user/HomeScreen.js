import { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import { COLORS, BLOOD_GROUPS } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

// Readable label for a request.
const label = (r) => (r.itemType === 'blood' ? `${r.bloodGroup || ''} ${r.component || ''}`.trim() : r.medicineName);

// User home: greeting, quick search shortcuts, and the user's active requests.
export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [active, setActive] = useState([]);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/requests/mine');
      // "Active" = still in progress (pending or approved).
      setActive(data.filter((r) => r.status === 'pending' || r.status === 'approved'));
    } catch (err) {
      // ignore — the Requests tab shows the full list
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const firstName = user?.name ? user.name.split(' ')[0] : 'there';

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.hello}>Hi {firstName} 👋</Text>
      <Text style={styles.sub}>What do you need today?</Text>

      <Text style={styles.section}>Quick search</Text>
      <View style={styles.chips}>
        {BLOOD_GROUPS.map((g) => (
          <TouchableOpacity key={g} style={styles.chip} onPress={() => navigation.navigate('Search')}>
            <Text style={styles.chipText}>{g}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.section}>My active requests</Text>
      {active.length === 0 ? (
        <Text style={styles.muted}>No active requests right now.</Text>
      ) : (
        active.map((r) => (
          <Card key={r._id} onPress={() => navigation.navigate('Requests', { screen: 'RequestDetail', params: { id: r._id } })}>
            <View style={styles.rowBetween}>
              <Text style={styles.cardTitle}>{label(r)} ×{r.quantity}</Text>
              <StatusBadge status={r.status} />
            </View>
            <Text style={styles.urgency}>{r.urgency} urgency</Text>
          </Card>
        ))
      )}

      <Card style={{ marginTop: 20 }} onPress={() => navigation.navigate('Notifications')}>
        <Text style={styles.cardTitle}>🔔 View your notifications</Text>
        <Text style={styles.muted}>Status updates, messages and urgent alerts</Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 20, backgroundColor: COLORS.background },
  hello: { fontSize: 26, fontWeight: '800', color: COLORS.text },
  sub: { fontSize: 15, color: COLORS.textMuted, marginBottom: 20 },
  section: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginTop: 20, marginBottom: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: COLORS.primaryLight },
  chipText: { color: COLORS.primaryDark, fontWeight: '700' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  muted: { color: COLORS.textMuted, marginTop: 4 },
  urgency: { color: COLORS.textMuted, marginTop: 4, textTransform: 'capitalize' },
});

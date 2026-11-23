import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { COLORS } from '../../utils/constants';

// Staff dashboard: at-a-glance counts. Real counts arrive in Phase 4.
const STATS = [
  { label: 'Pending requests', value: 3, color: COLORS.orange },
  { label: 'Low stock items', value: 2, color: COLORS.red },
  { label: 'Expiring soon', value: 4, color: COLORS.orange },
  { label: 'Expired', value: 1, color: COLORS.red },
];

export default function DashboardScreen() {
  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.title}>City Hospital</Text>
      <Text style={styles.muted}>Facility dashboard</Text>

      <View style={styles.grid}>
        {STATS.map((s) => (
          <View key={s.label} style={styles.statCard}>
            <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 20, backgroundColor: COLORS.background },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.text },
  muted: { color: COLORS.textMuted, marginTop: 4, marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: {
    width: '47%',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statValue: { fontSize: 34, fontWeight: '800' },
  statLabel: { color: COLORS.textMuted, marginTop: 6 },
});

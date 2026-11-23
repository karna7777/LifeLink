import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Button from '../../components/Button';
import { COLORS } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';

// Admin overview stats. Real counts arrive from /admin/stats in Phase 3.
const STATS = [
  { label: 'Total users', value: 128 },
  { label: 'Facilities', value: 14 },
  { label: 'Verified facilities', value: 9 },
  { label: 'Total requests', value: 342 },
];

export default function AdminStatsScreen() {
  const { logout } = useAuth();
  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.title}>Platform stats</Text>
      <View style={styles.grid}>
        {STATS.map((s) => (
          <View key={s.label} style={styles.card}>
            <Text style={styles.value}>{s.value}</Text>
            <Text style={styles.label}>{s.label}</Text>
          </View>
        ))}
      </View>
      <Button title="Logout" variant="outline" style={{ marginTop: 24 }} onPress={logout} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 20, backgroundColor: COLORS.background },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.text, marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { width: '47%', backgroundColor: COLORS.card, borderRadius: 12, padding: 20, borderWidth: 1, borderColor: COLORS.border },
  value: { fontSize: 32, fontWeight: '800', color: COLORS.primary },
  label: { color: COLORS.textMuted, marginTop: 6 },
});

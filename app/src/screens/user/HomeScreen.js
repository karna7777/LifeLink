import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import { COLORS, BLOOD_GROUPS } from '../../utils/constants';

// User home: greeting, quick blood-group search, active requests, urgent alerts.
// Data here is dummy; Phase 5/6 replace it with real API calls.
const DUMMY_ACTIVE = [
  { id: '1', title: 'B+ Whole Blood', facility: 'City Hospital', status: 'pending' },
  { id: '2', title: 'Paracetamol', facility: 'Apollo Pharmacy', status: 'approved' },
];

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.hello}>Hi there 👋</Text>
      <Text style={styles.sub}>What do you need today?</Text>

      <Text style={styles.section}>Quick blood search</Text>
      <View style={styles.chips}>
        {BLOOD_GROUPS.map((g) => (
          <TouchableOpacity key={g} style={styles.chip} onPress={() => navigation.navigate('Search')}>
            <Text style={styles.chipText}>{g}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.section}>My active requests</Text>
      {DUMMY_ACTIVE.map((r) => (
        <Card key={r.id}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>{r.title}</Text>
            <StatusBadge status={r.status} />
          </View>
          <Text style={styles.muted}>{r.facility}</Text>
        </Card>
      ))}

      <Text style={styles.section}>Urgent alerts</Text>
      <Card>
        <Text style={styles.cardTitle}>🩸 O- needed at City Hospital</Text>
        <Text style={styles.muted}>2.4 km away · tap to help (donor alerts in Phase 8)</Text>
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
});

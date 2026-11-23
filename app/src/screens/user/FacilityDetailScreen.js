import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Card from '../../components/Card';
import Button from '../../components/Button';
import ExpiryBadge from '../../components/ExpiryBadge';
import { COLORS } from '../../utils/constants';

// Facility details + its available stock. Data is dummy in Phase 1.
const DUMMY_STOCK = [
  { id: '1', label: 'B+ Whole Blood', qty: '12 units', expiry: '2026-12-10' },
  { id: '2', label: 'O- Plasma', qty: '4 units', expiry: '2026-11-28' },
];

export default function FacilityDetailScreen({ route, navigation }) {
  const name = route.params?.name || 'Facility';

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.muted}>Hospital · 2.4 km away</Text>
      <Text style={styles.muted}>📞 +91 98765 43210</Text>

      <Button title="Open in Maps" variant="outline" style={{ marginTop: 14 }} onPress={() => {}} />

      <Text style={styles.section}>Available stock</Text>
      {DUMMY_STOCK.map((s) => (
        <Card key={s.id}>
          <View style={styles.rowBetween}>
            <Text style={styles.itemTitle}>{s.label}</Text>
            <ExpiryBadge expiryDate={s.expiry} />
          </View>
          <Text style={styles.muted}>{s.qty}</Text>
        </Card>
      ))}

      <Button title="Create request" style={{ marginTop: 10 }} onPress={() => navigation.navigate('CreateRequest', { facilityName: name })} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 20, backgroundColor: COLORS.background },
  name: { fontSize: 24, fontWeight: '800', color: COLORS.text },
  muted: { color: COLORS.textMuted, marginTop: 4 },
  section: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginTop: 24, marginBottom: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text },
});

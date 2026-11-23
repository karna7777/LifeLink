import { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Card from '../../components/Card';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';
import { COLORS } from '../../utils/constants';

// Admin reviews facilities and verifies/rejects them. Real actions arrive in Phase 3.
const DUMMY_FACILITIES = [
  { id: '1', name: 'City Hospital', type: 'hospital', verified: false },
  { id: '2', name: 'Red Cross Blood Bank', type: 'blood_bank', verified: true },
  { id: '3', name: 'Apollo Pharmacy', type: 'pharmacy', verified: false },
];

export default function FacilitiesListScreen() {
  const [facilities] = useState(DUMMY_FACILITIES);

  return (
    <FlatList
      style={styles.wrap}
      data={facilities}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 20 }}
      ListEmptyComponent={<EmptyState title="No facilities yet" />}
      renderItem={({ item }) => (
        <Card>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.muted}>{item.type.replace('_', ' ')}</Text>
          <Text style={[styles.status, { color: item.verified ? COLORS.green : COLORS.orange }]}>
            {item.verified ? '✓ Verified' : '⏳ Pending'}
          </Text>
          {!item.verified && (
            <View style={styles.actions}>
              <Button title="Verify" style={{ flex: 1 }} onPress={() => {}} />
              <Button title="Reject" variant="outline" style={{ flex: 1 }} onPress={() => {}} />
            </View>
          )}
        </Card>
      )}
    />
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: COLORS.background },
  name: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  muted: { color: COLORS.textMuted, marginTop: 4, textTransform: 'capitalize' },
  status: { marginTop: 8, fontWeight: '700' },
  actions: { flexDirection: 'row', gap: 10, marginTop: 12 },
});

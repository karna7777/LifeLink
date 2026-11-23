import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Input from '../../components/Input';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import { COLORS } from '../../utils/constants';

// Search for blood or medicine nearby. Results are dummy in Phase 1;
// Phase 5 adds the real /search API with distance sorting.
const DUMMY_RESULTS = [
  { id: '1', name: 'City Hospital', distance: '2.4 km', available: '12 units' },
  { id: '2', name: 'Red Cross Blood Bank', distance: '3.1 km', available: '5 units' },
  { id: '3', name: 'Apollo Pharmacy', distance: '0.8 km', available: '30 strips' },
];

export default function SearchScreen({ navigation }) {
  const [mode, setMode] = useState('blood'); // 'blood' or 'medicine'
  const [query, setQuery] = useState('');

  return (
    <View style={styles.wrap}>
      <View style={styles.toggle}>
        {['blood', 'medicine'].map((m) => (
          <TouchableOpacity
            key={m}
            style={[styles.toggleBtn, mode === m && styles.toggleActive]}
            onPress={() => setMode(m)}
          >
            <Text style={[styles.toggleText, mode === m && styles.toggleTextActive]}>
              {m === 'blood' ? 'Blood' : 'Medicine'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Input
        value={query}
        onChangeText={setQuery}
        placeholder={mode === 'blood' ? 'Blood group e.g. B+' : 'Medicine name e.g. Paracetamol'}
      />

      <FlatList
        data={DUMMY_RESULTS}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<EmptyState title="No facilities found" message="Try a different search." />}
        renderItem={({ item }) => (
          <Card onPress={() => navigation.navigate('FacilityDetail', { id: item.id, name: item.name })}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.muted}>{item.distance} away · {item.available} available</Text>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 20, backgroundColor: COLORS.background },
  toggle: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: 10, padding: 4, marginBottom: 16 },
  toggleBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  toggleActive: { backgroundColor: COLORS.primary },
  toggleText: { color: COLORS.textMuted, fontWeight: '700' },
  toggleTextActive: { color: COLORS.white },
  name: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  muted: { color: COLORS.textMuted, marginTop: 4 },
});

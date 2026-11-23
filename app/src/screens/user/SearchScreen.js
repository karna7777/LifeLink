import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import Loader from '../../components/Loader';
import { COLORS } from '../../utils/constants';
import api from '../../services/api';
import { getCurrentLocation } from '../../services/location';

// Search nearby verified facilities that have the blood/medicine in stock.
export default function SearchScreen({ navigation }) {
  const [mode, setMode] = useState('blood'); // 'blood' or 'medicine'
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null); // null = not searched yet
  const [loading, setLoading] = useState(false);

  async function runSearch() {
    if (!query.trim()) {
      return Alert.alert('Enter a value', mode === 'blood' ? 'Enter a blood group, e.g. B+' : 'Enter a medicine name');
    }
    setLoading(true);
    try {
      const loc = await getCurrentLocation(); // null if permission denied — search still works
      const params = new URLSearchParams({ type: mode });
      if (mode === 'blood') params.append('bloodGroup', query.trim().toUpperCase());
      else params.append('name', query.trim());
      if (loc) {
        params.append('lat', loc.lat);
        params.append('lng', loc.lng);
      }
      const { data } = await api.get('/search?' + params.toString());
      setResults(data);
    } catch (err) {
      Alert.alert('Search failed', err.response?.data?.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.toggle}>
        {['blood', 'medicine'].map((m) => (
          <TouchableOpacity key={m} style={[styles.toggleBtn, mode === m && styles.toggleActive]} onPress={() => setMode(m)}>
            <Text style={[styles.toggleText, mode === m && styles.toggleTextActive]}>{m === 'blood' ? 'Blood' : 'Medicine'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Input value={query} onChangeText={setQuery} placeholder={mode === 'blood' ? 'Blood group e.g. B+' : 'Medicine name e.g. Paracetamol'} />
      <Button title="Search nearby" loading={loading} onPress={runSearch} />

      {loading ? (
        <Loader text="Searching…" />
      ) : results == null ? (
        <EmptyState title="Find supplies nearby" message="Pick blood or medicine, then search." />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingTop: 16 }}
          ListEmptyComponent={<EmptyState title="No facilities found" message="No verified facility nearby has this in stock." />}
          renderItem={({ item }) => (
            <Card onPress={() => navigation.navigate('FacilityDetail', { id: item._id, name: item.name })}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.muted}>
                {item.distanceKm != null ? `${item.distanceKm} km away` : 'distance unavailable'} · {item.available} {item.unit} available
              </Text>
            </Card>
          )}
        />
      )}
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

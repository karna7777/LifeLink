import { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Alert, StyleSheet } from 'react-native';
import Card from '../../components/Card';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';
import Loader from '../../components/Loader';
import { COLORS } from '../../utils/constants';
import api from '../../services/api';

// Admin reviews every facility and verifies / unverifies it.
export default function FacilitiesListScreen() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/admin/facilities');
      setFacilities(data);
    } catch (err) {
      Alert.alert('Error', 'Could not load facilities.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function setVerified(id, verified) {
    try {
      await api.put('/admin/facilities/' + id + '/verify', { verified });
      // Update just this row locally so the list reflects the change instantly.
      setFacilities((prev) => prev.map((f) => (f._id === id ? { ...f, verified } : f)));
    } catch (err) {
      Alert.alert('Error', 'Could not update this facility.');
    }
  }

  if (loading) return <Loader text="Loading facilities…" />;

  return (
    <FlatList
      style={styles.wrap}
      data={facilities}
      keyExtractor={(item) => item._id}
      contentContainerStyle={{ padding: 20 }}
      ListEmptyComponent={<EmptyState title="No facilities yet" message="Facilities created by staff show up here." />}
      renderItem={({ item }) => (
        <Card>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.muted}>{item.type.replace('_', ' ')}</Text>
          <Text style={[styles.status, { color: item.verified ? COLORS.green : COLORS.orange }]}>
            {item.verified ? '✓ Verified' : '⏳ Pending'}
          </Text>
          <View style={styles.actions}>
            {item.verified ? (
              <Button title="Unverify" variant="outline" style={{ flex: 1 }} onPress={() => setVerified(item._id, false)} />
            ) : (
              <Button title="Verify" style={{ flex: 1 }} onPress={() => setVerified(item._id, true)} />
            )}
          </View>
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

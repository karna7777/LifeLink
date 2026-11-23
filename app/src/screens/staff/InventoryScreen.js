import { useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Card from '../../components/Card';
import Button from '../../components/Button';
import ExpiryBadge from '../../components/ExpiryBadge';
import EmptyState from '../../components/EmptyState';
import Loader from '../../components/Loader';
import { COLORS } from '../../utils/constants';
import { useNetwork } from '../../context/NetworkContext';
import { getCache, setCache } from '../../services/storage';
import api from '../../services/api';

// Build a readable label from a stock item.
const itemLabel = (i) => (i.itemType === 'blood' ? `${i.bloodGroup || ''} ${i.component || ''}`.trim() : i.name);

// Facility inventory list with a blood/medicine filter. Taps open the add/edit screen.
export default function InventoryScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all'); // all | blood | medicine
  const [loading, setLoading] = useState(true);
  const { refreshKey } = useNetwork();

  const load = useCallback(async () => {
    const cached = await getCache('inventory'); // show saved data immediately
    if (cached) setItems(cached);
    try {
      const { data } = await api.get('/inventory');
      setItems(data);
      await setCache('inventory', data);
    } catch (err) {
      // offline / failed — keep the cached data
    } finally {
      setLoading(false);
    }
  }, []);

  // Refetch on focus, and on reconnect / app foreground.
  useFocusEffect(useCallback(() => { load(); }, [load]));
  useEffect(() => { load(); }, [refreshKey]);

  const shown = filter === 'all' ? items : items.filter((i) => i.itemType === filter);

  if (loading) return <Loader text="Loading inventory…" />;

  return (
    <View style={styles.wrap}>
      <View style={styles.filterRow}>
        {['all', 'blood', 'medicine'].map((f) => (
          <TouchableOpacity key={f} style={[styles.filterBtn, filter === f && styles.filterActive]} onPress={() => setFilter(f)}>
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={shown}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 90 }}
        ListEmptyComponent={<EmptyState title="No items" message="Tap “Add item” to add your first stock item." />}
        renderItem={({ item }) => (
          <Card onPress={() => navigation.navigate('AddEditItem', { item })}>
            <View style={styles.rowBetween}>
              <Text style={styles.itemTitle}>{itemLabel(item)}</Text>
              <ExpiryBadge expiryDate={item.expiryDate} />
            </View>
            <Text style={styles.muted}>{item.quantity} {item.unit}{item.batchNo ? ` · batch ${item.batchNo}` : ''}</Text>
          </Card>
        )}
      />

      <View style={styles.fab}>
        <Button title="+ Add item" onPress={() => navigation.navigate('AddEditItem', {})} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 20, backgroundColor: COLORS.background },
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  filterBtn: { flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, paddingVertical: 8, alignItems: 'center' },
  filterActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { color: COLORS.textMuted, fontWeight: '700', textTransform: 'capitalize' },
  filterTextActive: { color: COLORS.white },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  muted: { color: COLORS.textMuted, marginTop: 4 },
  fab: { position: 'absolute', left: 20, right: 20, bottom: 20 },
});

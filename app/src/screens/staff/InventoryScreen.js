import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Card from '../../components/Card';
import Button from '../../components/Button';
import ExpiryBadge from '../../components/ExpiryBadge';
import EmptyState from '../../components/EmptyState';
import { COLORS } from '../../utils/constants';

// Facility inventory with blood/medicine filter. CRUD arrives in Phase 4.
const DUMMY_ITEMS = [
  { id: '1', type: 'blood', label: 'B+ Whole Blood', qty: '12 units', expiry: '2026-12-20' },
  { id: '2', type: 'blood', label: 'O- Plasma', qty: '4 units', expiry: '2026-11-27' },
  { id: '3', type: 'medicine', label: 'Paracetamol', qty: '30 strips', expiry: '2027-03-01' },
  { id: '4', type: 'medicine', label: 'Insulin', qty: '8 bottles', expiry: '2026-11-24' },
];

export default function InventoryScreen({ navigation }) {
  const [filter, setFilter] = useState('all'); // all | blood | medicine
  const items = filter === 'all' ? DUMMY_ITEMS : DUMMY_ITEMS.filter((i) => i.type === filter);

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
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 90 }}
        ListEmptyComponent={<EmptyState title="No items" message="Add your first stock item." />}
        renderItem={({ item }) => (
          <Card onPress={() => navigation.navigate('AddEditItem', { item })}>
            <View style={styles.rowBetween}>
              <Text style={styles.itemTitle}>{item.label}</Text>
              <ExpiryBadge expiryDate={item.expiry} />
            </View>
            <Text style={styles.muted}>{item.qty}</Text>
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

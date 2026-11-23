import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import Input from '../../components/Input';
import Button from '../../components/Button';
import BloodGroupPicker from '../../components/BloodGroupPicker';
import { COLORS, BLOOD_COMPONENTS } from '../../utils/constants';
import api from '../../services/api';

const UNITS = ['units', 'strips', 'bottles'];

// Add a new stock item or edit/delete an existing one.
export default function AddEditItemScreen({ route, navigation }) {
  const existing = route.params?.item;

  const [itemType, setItemType] = useState(existing?.itemType || 'blood');
  const [bloodGroup, setBloodGroup] = useState(existing?.bloodGroup || null);
  const [component, setComponent] = useState(existing?.component || BLOOD_COMPONENTS[0]);
  const [name, setName] = useState(existing?.name || '');
  const [quantity, setQuantity] = useState(existing ? String(existing.quantity) : '');
  const [unit, setUnit] = useState(existing?.unit || 'units');
  const [batchNo, setBatchNo] = useState(existing?.batchNo || '');
  const [expiry, setExpiry] = useState(existing?.expiryDate ? existing.expiryDate.slice(0, 10) : '');
  const [saving, setSaving] = useState(false);

  async function save() {
    // Client-side validation mirrors the server rules.
    const qty = Number(quantity);
    if (!qty || qty <= 0) return Alert.alert('Quantity', 'Enter a quantity greater than 0.');
    if (itemType === 'blood' && !bloodGroup) return Alert.alert('Blood group', 'Select a blood group.');
    if (itemType === 'medicine' && !name) return Alert.alert('Medicine name', 'Enter the medicine name.');

    const body = {
      itemType,
      quantity: qty,
      unit,
      batchNo,
      expiryDate: expiry || undefined,
      bloodGroup: itemType === 'blood' ? bloodGroup : undefined,
      component: itemType === 'blood' ? component : undefined,
      name: itemType === 'medicine' ? name : undefined,
    };

    setSaving(true);
    try {
      if (existing) await api.put('/inventory/' + existing._id, body);
      else await api.post('/inventory', body);
      navigation.goBack(); // InventoryScreen refetches on focus
    } catch (err) {
      Alert.alert('Could not save', err.response?.data?.message || 'Please try again.');
    } finally {
      setSaving(false);
    }
  }

  function confirmDelete() {
    Alert.alert('Delete item', 'Remove this item from inventory?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete('/inventory/' + existing._id);
            navigation.goBack();
          } catch (err) {
            Alert.alert('Could not delete', err.response?.data?.message || 'Please try again.');
          }
        },
      },
    ]);
  }

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.title}>{existing ? 'Edit item' : 'Add item'}</Text>

      <View style={styles.row}>
        {['blood', 'medicine'].map((t) => (
          <TouchableOpacity key={t} style={[styles.chip, itemType === t && styles.chipActive]} onPress={() => setItemType(t)}>
            <Text style={[styles.chipText, itemType === t && styles.chipTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {itemType === 'blood' ? (
        <>
          <Text style={styles.label}>Blood group</Text>
          <BloodGroupPicker value={bloodGroup} onChange={setBloodGroup} />
          <Text style={styles.label}>Component</Text>
          <View style={styles.wrapRow}>
            {BLOOD_COMPONENTS.map((c) => (
              <TouchableOpacity key={c} style={[styles.smallChip, component === c && styles.chipActive]} onPress={() => setComponent(c)}>
                <Text style={[styles.chipText, component === c && styles.chipTextActive]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      ) : (
        <Input label="Medicine name" value={name} onChangeText={setName} placeholder="e.g. Paracetamol" />
      )}

      <Input label="Quantity" value={quantity} onChangeText={setQuantity} placeholder="e.g. 12" keyboardType="number-pad" />

      <Text style={styles.label}>Unit</Text>
      <View style={styles.row}>
        {UNITS.map((u) => (
          <TouchableOpacity key={u} style={[styles.chip, unit === u && styles.chipActive]} onPress={() => setUnit(u)}>
            <Text style={[styles.chipText, unit === u && styles.chipTextActive]}>{u}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Input label="Batch number" value={batchNo} onChangeText={setBatchNo} placeholder="e.g. B-2291" />
      <Input label="Expiry date" value={expiry} onChangeText={setExpiry} placeholder="YYYY-MM-DD" />

      <Button title={existing ? 'Save changes' : 'Add item'} loading={saving} style={{ marginTop: 10 }} onPress={save} />
      {existing && <Button title="Delete item" variant="outline" style={{ marginTop: 10 }} onPress={confirmDelete} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 20, backgroundColor: COLORS.background },
  title: { fontSize: 20, fontWeight: '800', color: COLORS.text, marginBottom: 16 },
  label: { fontSize: 13, color: COLORS.textMuted, marginBottom: 8, marginTop: 10, fontWeight: '600' },
  row: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  wrapRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { flex: 1, borderWidth: 1, borderColor: COLORS.primary, borderRadius: 20, paddingVertical: 10, alignItems: 'center' },
  smallChip: { borderWidth: 1, borderColor: COLORS.primary, borderRadius: 20, paddingVertical: 8, paddingHorizontal: 14 },
  chipActive: { backgroundColor: COLORS.primary },
  chipText: { color: COLORS.primary, fontWeight: '700', textTransform: 'capitalize' },
  chipTextActive: { color: COLORS.white },
});

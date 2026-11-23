import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Input from '../../components/Input';
import Button from '../../components/Button';
import BloodGroupPicker from '../../components/BloodGroupPicker';
import { COLORS, BLOOD_COMPONENTS } from '../../utils/constants';

// Add or edit an inventory item. Saving is wired up in Phase 4.
export default function AddEditItemScreen({ route, navigation }) {
  const existing = route.params?.item;
  const [itemType, setItemType] = useState(existing?.type || 'blood');
  const [name, setName] = useState('');
  const [bloodGroup, setBloodGroup] = useState(null);
  const [component, setComponent] = useState(BLOOD_COMPONENTS[0]);
  const [quantity, setQuantity] = useState('');
  const [batchNo, setBatchNo] = useState('');
  const [expiry, setExpiry] = useState('');

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
      <Input label="Batch number" value={batchNo} onChangeText={setBatchNo} placeholder="e.g. B-2291" />
      <Input label="Expiry date" value={expiry} onChangeText={setExpiry} placeholder="YYYY-MM-DD" />

      <Button title="Save item" style={{ marginTop: 10 }} onPress={() => navigation.goBack()} />
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

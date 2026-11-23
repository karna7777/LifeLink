import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { COLORS, URGENCY_LEVELS } from '../../utils/constants';

// Create a request to a facility. Submitting is wired up in Phase 6
// (with optional prescription photo via image picker + multer).
export default function CreateRequestScreen({ route, navigation }) {
  const facilityName = route.params?.facilityName || 'Facility';
  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [urgency, setUrgency] = useState('normal');
  const [note, setNote] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.title}>Request from {facilityName}</Text>

      <Input label="Item (blood group or medicine)" value={item} onChangeText={setItem} placeholder="e.g. B+ Whole Blood" />
      <Input label="Quantity" value={quantity} onChangeText={setQuantity} placeholder="e.g. 2" keyboardType="number-pad" />

      <Text style={styles.label}>Urgency</Text>
      <View style={styles.row}>
        {URGENCY_LEVELS.map((u) => (
          <TouchableOpacity key={u} style={[styles.chip, urgency === u && styles.chipActive]} onPress={() => setUrgency(u)}>
            <Text style={[styles.chipText, urgency === u && styles.chipTextActive]}>{u}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Input label="Note (optional)" value={note} onChangeText={setNote} placeholder="Anything the facility should know" multiline />

      <Button title="Attach prescription photo" variant="outline" onPress={() => {}} />
      <Button title="Send request" style={{ marginTop: 10 }} onPress={() => navigation.goBack()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 20, backgroundColor: COLORS.background },
  title: { fontSize: 20, fontWeight: '800', color: COLORS.text, marginBottom: 20 },
  label: { fontSize: 13, color: COLORS.textMuted, marginBottom: 8, fontWeight: '600' },
  row: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  chip: { flex: 1, borderWidth: 1, borderColor: COLORS.primary, borderRadius: 20, paddingVertical: 10, alignItems: 'center' },
  chipActive: { backgroundColor: COLORS.primary },
  chipText: { color: COLORS.primary, fontWeight: '700', textTransform: 'capitalize' },
  chipTextActive: { color: COLORS.white },
});

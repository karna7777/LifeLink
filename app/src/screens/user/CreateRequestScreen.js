import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Input from '../../components/Input';
import Button from '../../components/Button';
import BloodGroupPicker from '../../components/BloodGroupPicker';
import { COLORS, URGENCY_LEVELS, BLOOD_COMPONENTS } from '../../utils/constants';
import api from '../../services/api';

// Create a request to a facility, with an optional prescription photo.
export default function CreateRequestScreen({ route, navigation }) {
  const facilityId = route.params?.facilityId;
  const facilityName = route.params?.facilityName || 'Facility';

  const [itemType, setItemType] = useState('blood');
  const [bloodGroup, setBloodGroup] = useState(null);
  const [component, setComponent] = useState(BLOOD_COMPONENTS[0]);
  const [medicineName, setMedicineName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [urgency, setUrgency] = useState('normal');
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState(null);
  const [saving, setSaving] = useState(false);

  // Pick a prescription image from the gallery.
  async function pickImage() {
    const res = await ImagePicker.launchImageLibraryAsync({ quality: 0.5 });
    if (!res.canceled) setPhoto(res.assets[0]);
  }

  async function submit() {
    const qty = Number(quantity);
    if (!qty || qty <= 0) return Alert.alert('Quantity', 'Enter a quantity greater than 0.');
    if (itemType === 'blood' && !bloodGroup) return Alert.alert('Blood group', 'Select a blood group.');
    if (itemType === 'medicine' && !medicineName) return Alert.alert('Medicine', 'Enter the medicine name.');

    // Build multipart form data so we can send the optional image too.
    const form = new FormData();
    form.append('facilityId', facilityId);
    form.append('itemType', itemType);
    form.append('quantity', String(qty));
    form.append('urgency', urgency);
    if (note) form.append('note', note);
    if (itemType === 'blood') {
      form.append('bloodGroup', bloodGroup);
      form.append('component', component);
    } else {
      form.append('medicineName', medicineName);
    }
    if (photo) form.append('prescription', { uri: photo.uri, name: 'prescription.jpg', type: 'image/jpeg' });

    setSaving(true);
    try {
      await api.post('/requests', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      Alert.alert('Request sent', 'Track it in the Requests tab.');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Could not send', err.response?.data?.message || 'Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.title}>Request from {facilityName}</Text>

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
        <Input label="Medicine name" value={medicineName} onChangeText={setMedicineName} placeholder="e.g. Paracetamol" />
      )}

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

      <Button title={photo ? 'Change prescription photo' : 'Attach prescription photo'} variant="outline" onPress={pickImage} />
      {photo && <Image source={{ uri: photo.uri }} style={styles.preview} />}

      <Button title="Send request" loading={saving} style={{ marginTop: 10 }} onPress={submit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 20, backgroundColor: COLORS.background },
  title: { fontSize: 20, fontWeight: '800', color: COLORS.text, marginBottom: 20 },
  label: { fontSize: 13, color: COLORS.textMuted, marginBottom: 8, marginTop: 10, fontWeight: '600' },
  row: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  wrapRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { flex: 1, borderWidth: 1, borderColor: COLORS.primary, borderRadius: 20, paddingVertical: 10, alignItems: 'center' },
  smallChip: { borderWidth: 1, borderColor: COLORS.primary, borderRadius: 20, paddingVertical: 8, paddingHorizontal: 14 },
  chipActive: { backgroundColor: COLORS.primary },
  chipText: { color: COLORS.primary, fontWeight: '700', textTransform: 'capitalize' },
  chipTextActive: { color: COLORS.white },
  preview: { width: '100%', height: 180, borderRadius: 10, marginTop: 10 },
});

import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Input from '../../components/Input';
import Button from '../../components/Button';
import BloodGroupPicker from '../../components/BloodGroupPicker';
import { COLORS } from '../../utils/constants';

// Register screen. Account creation is wired up in Phase 2.
export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('user'); // 'user' or 'staff'
  const [bloodGroup, setBloodGroup] = useState(null);

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.title}>Create account</Text>

      <Input label="Full name" value={name} onChangeText={setName} placeholder="Your name" />
      <Input label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" />
      <Input label="Phone" value={phone} onChangeText={setPhone} placeholder="Phone number" keyboardType="phone-pad" />
      <Input label="Password" value={password} onChangeText={setPassword} placeholder="Create a password" secureTextEntry />

      <Text style={styles.label}>I am a</Text>
      <View style={styles.roleRow}>
        {['user', 'staff'].map((r) => (
          <TouchableOpacity
            key={r}
            style={[styles.roleChip, role === r && styles.roleActive]}
            onPress={() => setRole(r)}
          >
            <Text style={[styles.roleText, role === r && styles.roleTextActive]}>
              {r === 'user' ? 'Patient / Donor' : 'Facility staff'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {role === 'user' && (
        <>
          <Text style={styles.label}>Blood group</Text>
          <BloodGroupPicker value={bloodGroup} onChange={setBloodGroup} />
        </>
      )}

      <Button title="Register" style={{ marginTop: 20 }} onPress={() => {}} />
      <Button title="Back to login" variant="outline" style={{ marginTop: 10 }} onPress={() => navigation.goBack()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 24, backgroundColor: COLORS.background, flexGrow: 1 },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.text, marginBottom: 20 },
  label: { fontSize: 13, color: COLORS.textMuted, marginBottom: 8, marginTop: 6, fontWeight: '600' },
  roleRow: { flexDirection: 'row', gap: 10, marginBottom: 6 },
  roleChip: { flex: 1, borderWidth: 1, borderColor: COLORS.primary, borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  roleActive: { backgroundColor: COLORS.primary },
  roleText: { color: COLORS.primary, fontWeight: '700' },
  roleTextActive: { color: COLORS.white },
});

import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import Input from '../../components/Input';
import Button from '../../components/Button';
import BloodGroupPicker from '../../components/BloodGroupPicker';
import { COLORS } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';

// Register screen — calls the real /auth/register via AuthContext.
export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('user'); // 'user' or 'staff'
  const [bloodGroup, setBloodGroup] = useState(null);
  const [loading, setLoading] = useState(false);

  async function onRegister() {
    if (!name || !email || !password) {
      return Alert.alert('Missing info', 'Name, email and password are required.');
    }
    if (password.length < 6) {
      return Alert.alert('Weak password', 'Password must be at least 6 characters.');
    }
    if (role === 'user' && !bloodGroup) {
      return Alert.alert('Blood group', 'Please select your blood group.');
    }
    setLoading(true);
    try {
      await register({
        name,
        email: email.trim().toLowerCase(),
        password,
        phone,
        role,
        bloodGroup: role === 'user' ? bloodGroup : undefined,
      });
      // On success RootNavigator switches to the role's screens automatically.
    } catch (err) {
      Alert.alert('Registration failed', err.response?.data?.message || 'Could not reach the server.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.title}>Create account</Text>

      <Input label="Full name" value={name} onChangeText={setName} placeholder="Your name" />
      <Input label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" />
      <Input label="Phone" value={phone} onChangeText={setPhone} placeholder="Phone number" keyboardType="phone-pad" />
      <Input label="Password" value={password} onChangeText={setPassword} placeholder="At least 6 characters" secureTextEntry />

      <Text style={styles.label}>I am a</Text>
      <View style={styles.roleRow}>
        {['user', 'staff'].map((r) => (
          <TouchableOpacity key={r} style={[styles.roleChip, role === r && styles.roleActive]} onPress={() => setRole(r)}>
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

      <Button title="Register" loading={loading} style={{ marginTop: 20 }} onPress={onRegister} />
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

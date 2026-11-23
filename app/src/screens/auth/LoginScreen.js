import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { COLORS } from '../../utils/constants';
import { useDevAuth } from '../../navigation/RootNavigator';

// Login screen. Real authentication is wired up in Phase 2.
export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setRole } = useDevAuth(); // Phase 1 dev shortcut only

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.logo}>LifeLink</Text>
      <Text style={styles.tagline}>Find blood & medicines in an emergency</Text>

      <Input label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" />
      <Input label="Password" value={password} onChangeText={setPassword} placeholder="Your password" secureTextEntry />
      <Button title="Login" onPress={() => {}} />
      <Button title="Create an account" variant="outline" style={{ marginTop: 10 }} onPress={() => navigation.navigate('Register')} />

      {/* Phase 1 ONLY: jump into a role to preview its screens. Removed when real auth lands in Phase 2. */}
      <Text style={styles.devTitle}>Dev preview (temporary)</Text>
      <View style={styles.devRow}>
        <Button title="User" style={styles.devBtn} onPress={() => setRole('user')} />
        <Button title="Staff" style={styles.devBtn} onPress={() => setRole('staff')} />
        <Button title="Admin" style={styles.devBtn} onPress={() => setRole('admin')} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 24, paddingTop: 60, backgroundColor: COLORS.background, flexGrow: 1 },
  logo: { fontSize: 40, fontWeight: '800', color: COLORS.primary, textAlign: 'center' },
  tagline: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center', marginBottom: 36 },
  devTitle: { marginTop: 40, marginBottom: 10, color: COLORS.textMuted, fontSize: 12, textAlign: 'center' },
  devRow: { flexDirection: 'row', gap: 8 },
  devBtn: { flex: 1 },
});

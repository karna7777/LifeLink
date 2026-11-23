import { useState } from 'react';
import { Text, ScrollView, Alert, StyleSheet } from 'react-native';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { COLORS } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';

// Login screen — calls the real /auth/login via AuthContext.
export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onLogin() {
    if (!email || !password) {
      return Alert.alert('Missing info', 'Please enter your email and password.');
    }
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
      // On success RootNavigator automatically shows the right screens for the role.
    } catch (err) {
      Alert.alert('Login failed', err.response?.data?.message || 'Could not reach the server.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.logo}>LifeLink</Text>
      <Text style={styles.tagline}>Find blood & medicines in an emergency</Text>

      <Input label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" />
      <Input label="Password" value={password} onChangeText={setPassword} placeholder="Your password" secureTextEntry />
      <Button title="Login" loading={loading} onPress={onLogin} />
      <Button title="Create an account" variant="outline" style={{ marginTop: 10 }} onPress={() => navigation.navigate('Register')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 24, paddingTop: 80, backgroundColor: COLORS.background, flexGrow: 1 },
  logo: { fontSize: 40, fontWeight: '800', color: COLORS.primary, textAlign: 'center' },
  tagline: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center', marginBottom: 40 },
});

import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import { COLORS } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

// Admin overview stats from /admin/stats.
export default function AdminStatsScreen() {
  const { logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/admin/stats');
        setStats(data);
      } catch (err) {
        Alert.alert('Error', 'Could not load stats.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader text="Loading stats…" />;

  const items = [
    { label: 'Total users', value: stats?.totalUsers ?? 0 },
    { label: 'Facilities', value: stats?.totalFacilities ?? 0 },
    { label: 'Verified facilities', value: stats?.verifiedFacilities ?? 0 },
    { label: 'Total requests', value: stats?.totalRequests ?? 0 },
  ];

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.title}>Platform stats</Text>
      <View style={styles.grid}>
        {items.map((s) => (
          <View key={s.label} style={styles.card}>
            <Text style={styles.value}>{s.value}</Text>
            <Text style={styles.label}>{s.label}</Text>
          </View>
        ))}
      </View>
      <Button title="Logout" variant="outline" style={{ marginTop: 24 }} onPress={logout} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 20, backgroundColor: COLORS.background },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.text, marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { width: '47%', backgroundColor: COLORS.card, borderRadius: 12, padding: 20, borderWidth: 1, borderColor: COLORS.border },
  value: { fontSize: 32, fontWeight: '800', color: COLORS.primary },
  label: { color: COLORS.textMuted, marginTop: 6 },
});

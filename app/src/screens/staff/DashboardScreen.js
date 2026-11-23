import { useState, useCallback } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Loader from '../../components/Loader';
import { COLORS } from '../../utils/constants';
import { getExpiryStatus } from '../../utils/expiry';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const LOW_STOCK = 5; // quantity below this counts as "low stock"

// Staff dashboard: facility name + verification status + live counts.
export default function DashboardScreen() {
  const { user } = useAuth();
  const [facility, setFacility] = useState(null);
  const [pending, setPending] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      // Facility (with its inventory) and the incoming requests, in parallel.
      const [facRes, reqRes] = await Promise.all([
        api.get('/facilities/' + user.facilityId),
        api.get('/requests/incoming'),
      ]);
      setFacility(facRes.data);
      setPending(reqRes.data.filter((r) => r.status === 'pending').length);
    } catch (err) {
      Alert.alert('Error', 'Could not load your dashboard.');
    } finally {
      setLoading(false);
    }
  }, [user.facilityId]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  if (loading) return <Loader text="Loading dashboard…" />;

  const inventory = facility?.inventory || [];
  const lowStock = inventory.filter((i) => i.quantity < LOW_STOCK).length;
  const expiringSoon = inventory.filter((i) => getExpiryStatus(i.expiryDate).level === 'soon').length;
  const expired = inventory.filter((i) => getExpiryStatus(i.expiryDate).level === 'expired').length;

  const stats = [
    { label: 'Pending requests', value: pending, color: COLORS.orange },
    { label: 'Low stock items', value: lowStock, color: COLORS.red },
    { label: 'Expiring soon', value: expiringSoon, color: COLORS.orange },
    { label: 'Expired', value: expired, color: COLORS.red },
  ];

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.title}>{facility?.name || 'My facility'}</Text>
      <Text style={[styles.badge, { color: facility?.verified ? COLORS.green : COLORS.orange }]}>
        {facility?.verified ? '✓ Verified' : '⏳ Pending admin verification'}
      </Text>

      <View style={styles.grid}>
        {stats.map((s) => (
          <View key={s.label} style={styles.statCard}>
            <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 20, backgroundColor: COLORS.background },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.text },
  badge: { fontWeight: '700', marginTop: 4, marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: { width: '47%', backgroundColor: COLORS.card, borderRadius: 12, padding: 20, borderWidth: 1, borderColor: COLORS.border },
  statValue: { fontSize: 34, fontWeight: '800' },
  statLabel: { color: COLORS.textMuted, marginTop: 6 },
});

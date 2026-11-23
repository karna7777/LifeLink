import { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import Loader from '../../components/Loader';
import { COLORS } from '../../utils/constants';
import api from '../../services/api';

const label = (r) => (r.itemType === 'blood' ? `${r.bloodGroup || ''} ${r.component || ''}`.trim() : r.medicineName);

// Requests sent to the staff member's facility (newest first).
export default function IncomingRequestsScreen({ navigation }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/requests/incoming');
      setRequests(data);
    } catch (err) {
      // leave empty on error
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  if (loading) return <Loader text="Loading requests…" />;

  return (
    <FlatList
      style={styles.wrap}
      data={requests}
      keyExtractor={(item) => item._id}
      contentContainerStyle={{ padding: 20 }}
      ListEmptyComponent={<EmptyState title="No incoming requests" message="Requests from patients will appear here." />}
      renderItem={({ item }) => (
        <Card onPress={() => navigation.navigate('RequestDetail', { id: item._id })}>
          <View style={styles.rowBetween}>
            <Text style={styles.title}>{label(item)} ×{item.quantity}</Text>
            <StatusBadge status={item.status} />
          </View>
          <Text style={styles.muted}>
            from {item.userId?.name || 'a patient'} · {item.urgency} urgency
          </Text>
        </Card>
      )}
    />
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: COLORS.background },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 15, fontWeight: '700', color: COLORS.text, flex: 1 },
  muted: { color: COLORS.textMuted, marginTop: 4, textTransform: 'capitalize' },
});

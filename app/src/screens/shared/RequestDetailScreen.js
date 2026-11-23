import { useState, useCallback } from 'react';
import { View, Text, ScrollView, Image, Alert, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import StatusBadge from '../../components/StatusBadge';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import { COLORS } from '../../utils/constants';
import { API_URL } from '../../config';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const label = (r) => (r.itemType === 'blood' ? `${r.bloodGroup || ''} ${r.component || ''}`.trim() : r.medicineName);

// Request detail: info, prescription image, status history, and actions.
// (A chat thread is added to this screen in Phase 7.)
export default function RequestDetailScreen({ route }) {
  const id = route.params?.id;
  const { user } = useAuth();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/requests/' + id);
      setRequest(data);
    } catch (err) {
      Alert.alert('Error', 'Could not load this request.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  async function changeStatus(status) {
    setWorking(true);
    try {
      const { data } = await api.put('/requests/' + id + '/status', { status });
      setRequest(data);
    } catch (err) {
      Alert.alert('Could not update', err.response?.data?.message || 'Please try again.');
    } finally {
      setWorking(false);
    }
  }

  if (loading) return <Loader text="Loading request…" />;
  if (!request) return <EmptyState title="Request not found" />;

  const isStaff = user?.role === 'staff';
  const isUser = user?.role === 'user';

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.title}>{label(request)} ×{request.quantity}</Text>
      <View style={styles.statusRow}>
        <StatusBadge status={request.status} />
        <Text style={styles.muted}>{request.urgency} urgency</Text>
      </View>

      {request.note ? <Text style={styles.note}>Note: {request.note}</Text> : null}
      {isStaff && request.userId?.name ? (
        <Text style={styles.muted}>From: {request.userId.name}{request.userId.phone ? ` · ${request.userId.phone}` : ''}</Text>
      ) : null}

      {request.prescriptionUrl ? (
        <>
          <Text style={styles.section}>Prescription</Text>
          <Image source={{ uri: API_URL + request.prescriptionUrl }} style={styles.image} />
        </>
      ) : null}

      <Text style={styles.section}>Status history</Text>
      {request.statusHistory.map((h, i) => (
        <View key={i} style={styles.historyRow}>
          <StatusBadge status={h.status} />
          <Text style={styles.muted}>{new Date(h.at).toLocaleString()}</Text>
        </View>
      ))}

      {/* Actions depend on the role and current status */}
      {isStaff && request.status === 'pending' && (
        <>
          <Button title="Approve" loading={working} style={{ marginTop: 20 }} onPress={() => changeStatus('approved')} />
          <Button title="Reject" variant="outline" style={{ marginTop: 10 }} onPress={() => changeStatus('rejected')} />
        </>
      )}
      {isStaff && request.status === 'approved' && (
        <Button title="Mark fulfilled" loading={working} style={{ marginTop: 20 }} onPress={() => changeStatus('fulfilled')} />
      )}
      {isUser && request.status === 'pending' && (
        <Button title="Cancel request" variant="outline" loading={working} style={{ marginTop: 20 }} onPress={() => changeStatus('cancelled')} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 20, backgroundColor: COLORS.background },
  title: { fontSize: 20, fontWeight: '800', color: COLORS.text },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  note: { color: COLORS.text, marginTop: 12 },
  muted: { color: COLORS.textMuted, marginTop: 4, textTransform: 'capitalize' },
  section: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginTop: 24, marginBottom: 12 },
  image: { width: '100%', height: 220, borderRadius: 10 },
  historyRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
});

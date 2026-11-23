import { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, Image, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import StatusBadge from '../../components/StatusBadge';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import { COLORS } from '../../utils/constants';
import { API_URL } from '../../config';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { useNetwork } from '../../context/NetworkContext';
import { getCache, setCache } from '../../services/storage';
import { enqueue } from '../../services/offlineQueue';
import api from '../../services/api';

const label = (r) => (r.itemType === 'blood' ? `${r.bloodGroup || ''} ${r.component || ''}`.trim() : r.medicineName);

// Request detail: info, prescription, status history + actions, and a live chat thread.
// Works offline: shows cached data, queues messages, and re-syncs on reconnect.
export default function RequestDetailScreen({ route }) {
  const id = route.params?.id;
  const { user } = useAuth();
  const socket = useSocket();
  const { online, refreshKey } = useNetwork();
  const [request, setRequest] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);

  // Load the request + chat: show cached data first, then refresh from the server.
  const load = useCallback(async () => {
    const cachedReq = await getCache('request:' + id);
    if (cachedReq) setRequest(cachedReq);
    const cachedMsgs = await getCache('messages:' + id);
    if (cachedMsgs) setMessages(cachedMsgs);
    try {
      const [reqRes, msgRes] = await Promise.all([api.get('/requests/' + id), api.get('/messages/' + id)]);
      setRequest(reqRes.data);
      setMessages(msgRes.data);
      await setCache('request:' + id, reqRes.data);
      await setCache('messages:' + id, msgRes.data);
    } catch (err) {
      // offline / failed — keep the cached data
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));
  useEffect(() => { load(); }, [refreshKey]); // refetch on reconnect / foreground

  // Real-time: join the room, re-join + refetch after a reconnect, and listen for updates.
  useEffect(() => {
    if (!socket) return;
    const joinAndReload = () => { socket.emit('join_request', { requestId: id }); load(); };
    const onMessage = (m) => {
      if (String(m.requestId) !== String(id)) return;
      setMessages((prev) => (prev.some((x) => x._id === m._id) ? prev : [...prev, m]));
    };
    const onStatus = (s) => {
      if (String(s.requestId) !== String(id)) return;
      setRequest((prev) => (prev ? { ...prev, status: s.status } : prev));
    };

    socket.emit('join_request', { requestId: id });
    socket.on('connect', joinAndReload); // re-join + refetch after reconnecting
    socket.on('message:new', onMessage);
    socket.on('request:status', onStatus);

    return () => {
      socket.emit('leave_request', { requestId: id });
      socket.off('connect', joinAndReload);
      socket.off('message:new', onMessage);
      socket.off('request:status', onStatus);
    };
  }, [socket, id, load]);

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

  async function send() {
    if (!draft.trim()) return;
    const text = draft.trim();
    setDraft('');

    // If offline, queue the message and show it as "sending…".
    if (!online) {
      await enqueue({ type: 'message', payload: { requestId: id, text } });
      setMessages((prev) => [...prev, { _id: 'local-' + Date.now(), text, senderId: user?._id, pending: true }]);
      return;
    }
    try {
      await api.post('/messages/' + id, { text });
      // The message comes back over the socket and is added to the list.
    } catch (err) {
      await enqueue({ type: 'message', payload: { requestId: id, text } });
      setMessages((prev) => [...prev, { _id: 'local-' + Date.now(), text, senderId: user?._id, pending: true }]);
    }
  }

  if (loading) return <Loader text="Loading request…" />;
  if (!request) return <EmptyState title="Request not found" />;

  const isStaff = user?.role === 'staff';
  const isUser = user?.role === 'user';
  const mine = (m) => String(m.senderId) === String(user?._id);

  return (
    <View style={styles.screen}>
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

        <Text style={styles.section}>Chat</Text>
        {messages.length === 0 ? (
          <Text style={styles.muted}>No messages yet.</Text>
        ) : (
          messages.map((m) => (
            <View key={m._id} style={[styles.bubble, mine(m) ? styles.mine : styles.theirs]}>
              {m.text ? <Text style={mine(m) ? styles.mineText : styles.theirsText}>{m.text}</Text> : null}
              {m.imageUrl ? <Image source={{ uri: API_URL + m.imageUrl }} style={styles.chatImage} /> : null}
              {m.pending ? <Text style={styles.pending}>sending…</Text> : null}
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.inputBar}>
        <TextInput style={styles.input} value={draft} onChangeText={setDraft} placeholder="Type a message" placeholderTextColor={COLORS.textMuted} />
        <TouchableOpacity style={styles.send} onPress={send}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  wrap: { padding: 20 },
  title: { fontSize: 20, fontWeight: '800', color: COLORS.text },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  note: { color: COLORS.text, marginTop: 12 },
  muted: { color: COLORS.textMuted, marginTop: 4, textTransform: 'capitalize' },
  section: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginTop: 24, marginBottom: 12 },
  image: { width: '100%', height: 220, borderRadius: 10 },
  historyRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  bubble: { maxWidth: '80%', padding: 12, borderRadius: 14, marginBottom: 8 },
  mine: { backgroundColor: COLORS.primary, alignSelf: 'flex-end' },
  theirs: { backgroundColor: COLORS.surface, alignSelf: 'flex-start' },
  mineText: { color: COLORS.white },
  theirsText: { color: COLORS.text },
  pending: { color: COLORS.white, fontSize: 10, marginTop: 4, fontStyle: 'italic', opacity: 0.8 },
  chatImage: { width: 160, height: 160, borderRadius: 8, marginTop: 6 },
  inputBar: { flexDirection: 'row', padding: 12, borderTopWidth: 1, borderColor: COLORS.border, gap: 8, alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, color: COLORS.text },
  send: { backgroundColor: COLORS.primary, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20 },
  sendText: { color: COLORS.white, fontWeight: '700' },
});

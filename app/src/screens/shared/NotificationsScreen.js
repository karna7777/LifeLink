import { useState, useCallback } from 'react';
import { Text, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import Loader from '../../components/Loader';
import { COLORS } from '../../utils/constants';
import api from '../../services/api';

// The user's notifications. Tapping one marks it read.
export default function NotificationsScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/notifications');
      setItems(data);
    } catch (err) {
      // leave empty on error
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  async function markRead(item) {
    if (item.read) return;
    try {
      await api.put('/notifications/' + item._id + '/read');
      setItems((prev) => prev.map((n) => (n._id === item._id ? { ...n, read: true } : n)));
    } catch (err) {
      // ignore
    }
  }

  if (loading) return <Loader text="Loading notifications…" />;

  return (
    <FlatList
      style={styles.wrap}
      data={items}
      keyExtractor={(item) => item._id}
      contentContainerStyle={{ padding: 20 }}
      ListEmptyComponent={<EmptyState title="No notifications" message="Alerts will appear here." />}
      renderItem={({ item }) => (
        <Card style={!item.read && styles.unread} onPress={() => markRead(item)}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.muted}>{item.body}</Text>
        </Card>
      )}
    />
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: COLORS.background },
  unread: { borderLeftWidth: 4, borderLeftColor: COLORS.primary },
  title: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  muted: { color: COLORS.textMuted, marginTop: 4 },
});

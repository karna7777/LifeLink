import { View, Text, FlatList, StyleSheet } from 'react-native';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import { COLORS } from '../../utils/constants';

// Notifications list. Real notifications are stored + pushed in Phase 8.
const DUMMY = [
  { id: '1', title: 'Request approved', body: 'City Hospital approved your B+ request.', read: false },
  { id: '2', title: 'New message', body: 'You have a new chat message.', read: true },
  { id: '3', title: 'Urgent: O- needed', body: 'A facility 3 km away needs O- donors.', read: true },
];

export default function NotificationsScreen() {
  return (
    <FlatList
      style={styles.wrap}
      data={DUMMY}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 20 }}
      ListEmptyComponent={<EmptyState title="No notifications" />}
      renderItem={({ item }) => (
        <Card style={!item.read && styles.unread}>
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

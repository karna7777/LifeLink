import { View, Text, SectionList, StyleSheet } from 'react-native';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import { COLORS } from '../../utils/constants';

// Incoming requests grouped by status. Real data + actions arrive in Phase 6.
const SECTIONS = [
  { title: 'Pending', data: [{ id: '1', title: 'B+ Whole Blood ×2', user: 'Rahul', status: 'pending' }] },
  { title: 'Approved', data: [{ id: '2', title: 'Paracetamol ×3', user: 'Asha', status: 'approved' }] },
  { title: 'Fulfilled', data: [{ id: '3', title: 'O- Plasma ×1', user: 'Imran', status: 'fulfilled' }] },
];

export default function IncomingRequestsScreen({ navigation }) {
  return (
    <SectionList
      style={styles.wrap}
      sections={SECTIONS}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 20 }}
      ListEmptyComponent={<EmptyState title="No incoming requests" />}
      renderSectionHeader={({ section }) => <Text style={styles.header}>{section.title}</Text>}
      renderItem={({ item }) => (
        <Card onPress={() => navigation.navigate('RequestDetail', { id: item.id, title: item.title })}>
          <View style={styles.rowBetween}>
            <Text style={styles.title}>{item.title}</Text>
            <StatusBadge status={item.status} />
          </View>
          <Text style={styles.muted}>from {item.user}</Text>
        </Card>
      )}
    />
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: COLORS.background },
  header: { fontSize: 15, fontWeight: '800', color: COLORS.text, marginTop: 10, marginBottom: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 15, fontWeight: '700', color: COLORS.text, flex: 1 },
  muted: { color: COLORS.textMuted, marginTop: 4 },
});

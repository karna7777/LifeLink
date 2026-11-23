import { View, Text, FlatList, StyleSheet } from 'react-native';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import { COLORS } from '../../utils/constants';

// List of the user's requests. Dummy data in Phase 1; real data in Phase 6.
const DUMMY_REQUESTS = [
  { id: '1', title: 'B+ Whole Blood ×2', facility: 'City Hospital', status: 'pending' },
  { id: '2', title: 'Paracetamol ×3', facility: 'Apollo Pharmacy', status: 'approved' },
  { id: '3', title: 'O- Plasma ×1', facility: 'Red Cross', status: 'fulfilled' },
  { id: '4', title: 'Insulin ×2', facility: 'MedPlus', status: 'rejected' },
];

export default function MyRequestsScreen({ navigation }) {
  return (
    <View style={styles.wrap}>
      <FlatList
        data={DUMMY_REQUESTS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
        ListEmptyComponent={<EmptyState title="No requests yet" message="Your requests will appear here." />}
        renderItem={({ item }) => (
          <Card onPress={() => navigation.navigate('RequestDetail', { id: item.id, title: item.title })}>
            <View style={styles.rowBetween}>
              <Text style={styles.title}>{item.title}</Text>
              <StatusBadge status={item.status} />
            </View>
            <Text style={styles.muted}>{item.facility}</Text>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: COLORS.background },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 15, fontWeight: '700', color: COLORS.text, flex: 1 },
  muted: { color: COLORS.textMuted, marginTop: 4 },
});

import { Text, View, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

// Coloured pill showing a request's status.
const COLOR_BY_STATUS = {
  pending: COLORS.orange,
  approved: COLORS.green,
  fulfilled: COLORS.green,
  rejected: COLORS.red,
  cancelled: COLORS.textMuted,
};

export default function StatusBadge({ status }) {
  const color = COLOR_BY_STATUS[status] || COLORS.textMuted;
  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={styles.text}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start' },
  text: { color: COLORS.white, fontSize: 12, fontWeight: '700', textTransform: 'capitalize' },
});

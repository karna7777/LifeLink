import { Text, View, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';
import { getExpiryStatus } from '../utils/expiry';

// Green/orange/red badge for inventory items based on their expiry date.
const COLOR_BY_LEVEL = {
  ok: COLORS.green,
  soon: COLORS.orange,
  expired: COLORS.red,
};

export default function ExpiryBadge({ expiryDate }) {
  const { level, label } = getExpiryStatus(expiryDate);
  return (
    <View style={[styles.badge, { backgroundColor: COLOR_BY_LEVEL[level] }]}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, alignSelf: 'flex-start' },
  text: { color: COLORS.white, fontSize: 11, fontWeight: '700' },
});

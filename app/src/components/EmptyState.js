import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

// Friendly placeholder shown when a list has no items.
export default function EmptyState({ title = 'Nothing here yet', message }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', padding: 40 },
  title: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 6 },
  message: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center' },
});

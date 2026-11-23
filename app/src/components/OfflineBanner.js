import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

// Red banner shown when the device is offline.
// In Phase 1 the `visible` prop is passed manually; Phase 9 wires it to NetInfo.
export default function OfflineBanner({ visible }) {
  if (!visible) return null;
  return (
    <View style={styles.banner}>
      <Text style={styles.text}>You are offline — showing saved data</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { backgroundColor: COLORS.textMuted, paddingVertical: 6, alignItems: 'center' },
  text: { color: COLORS.white, fontSize: 12, fontWeight: '600' },
});

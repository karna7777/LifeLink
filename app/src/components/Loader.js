import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

// Centered spinner shown while a screen is loading data.
export default function Loader({ text }) {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      {text ? <Text style={styles.text}>{text}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  text: { marginTop: 12, color: COLORS.textMuted },
});

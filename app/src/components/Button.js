import { Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '../utils/constants';

// Reusable button. variant 'primary' (filled red) or 'outline'.
// Shows a spinner while loading and blocks presses when loading/disabled.
export default function Button({ title, onPress, loading, disabled, variant = 'primary', style }) {
  const isOutline = variant === 'outline';
  return (
    <TouchableOpacity
      style={[styles.btn, isOutline && styles.outline, (disabled || loading) && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? COLORS.primary : COLORS.white} />
      ) : (
        <Text style={[styles.text, isOutline && styles.outlineText]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  disabled: { opacity: 0.5 },
  text: { color: COLORS.white, fontSize: 16, fontWeight: '600' },
  outlineText: { color: COLORS.primary },
});

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, BLOOD_GROUPS } from '../utils/constants';

// Row of selectable chips for the 8 blood groups.
// value is the selected group, onChange(group) fires on tap.
export default function BloodGroupPicker({ value, onChange }) {
  return (
    <View style={styles.wrap}>
      {BLOOD_GROUPS.map((g) => {
        const active = value === g;
        return (
          <TouchableOpacity
            key={g}
            style={[styles.chip, active && styles.active]}
            onPress={() => onChange(g)}
            activeOpacity={0.8}
          >
            <Text style={[styles.text, active && styles.activeText]}>{g}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  active: { backgroundColor: COLORS.primary },
  text: { color: COLORS.primary, fontWeight: '700' },
  activeText: { color: COLORS.white },
});

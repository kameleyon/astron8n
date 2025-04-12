import React from 'react';
import { Pressable, View, StyleSheet, ViewStyle } from 'react-native';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  style?: ViewStyle;
  disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  style,
  disabled
}) => {
  return (
    <Pressable
      style={[
        styles.box,
        checked && styles.checked,
        disabled && styles.disabled,
        style
      ]}
      onPress={() => !disabled && onChange(!checked)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
    >
      {checked && (
        <View style={styles.checkmark}>
          {/* Simple checkmark using border */}
          <View style={styles.checkShort} />
          <View style={styles.checkLong} />
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  box: {
    height: 20,
    width: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#2563eb',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  checked: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb'
  },
  disabled: {
    opacity: 0.5
  },
  checkmark: {
    position: 'relative',
    width: 12,
    height: 12
  },
  checkShort: {
    position: 'absolute',
    left: 2,
    top: 6,
    width: 3,
    height: 7,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#fff',
    transform: [{ rotate: '-45deg' }]
  },
  checkLong: {
    position: 'absolute',
    left: 5,
    top: 2,
    width: 7,
    height: 3,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: '#fff',
    transform: [{ rotate: '-45deg' }]
  }
});
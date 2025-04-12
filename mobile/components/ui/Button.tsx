import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle, PressableProps } from 'react-native';

type Variant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
type Size = 'default' | 'sm' | 'lg' | 'icon';

interface ButtonProps extends PressableProps {
  variant?: Variant;
  size?: Size;
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const variantStyles: Record<Variant, { button: ViewStyle; text: TextStyle }> = {
  default: {
    button: { backgroundColor: '#2563eb', borderWidth: 0 },
    text: { color: '#fff' }
  },
  destructive: {
    button: { backgroundColor: '#dc2626', borderWidth: 0 },
    text: { color: '#fff' }
  },
  outline: {
    button: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#d1d5db' },
    text: { color: '#111' }
  },
  secondary: {
    button: { backgroundColor: '#f3f4f6', borderWidth: 0 },
    text: { color: '#111' }
  },
  ghost: {
    button: { backgroundColor: 'transparent', borderWidth: 0 },
    text: { color: '#2563eb' }
  },
  link: {
    button: { backgroundColor: 'transparent', borderWidth: 0 },
    text: { color: '#2563eb', textDecorationLine: 'underline' }
  }
};

const sizeStyles: Record<Size, ViewStyle> = {
  default: { height: 40, paddingHorizontal: 16, borderRadius: 8 },
  sm: { height: 36, paddingHorizontal: 12, borderRadius: 8 },
  lg: { height: 48, paddingHorizontal: 24, borderRadius: 8 },
  icon: { height: 40, width: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'default',
  children,
  style,
  textStyle,
  ...props
}) => {
  const v = variantStyles[variant];
  const s = sizeStyles[size];

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        s,
        v.button,
        pressed && styles.pressed,
        style
      ]}
      accessibilityRole="button"
      {...props}
    >
      <Text style={[styles.text, v.text, textStyle]}>{children}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4
  },
  text: {
    fontSize: 16,
    fontWeight: '500'
  },
  pressed: {
    opacity: 0.7
  }
});
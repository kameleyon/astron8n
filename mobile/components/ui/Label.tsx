import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';

export const Label: React.FC<TextProps> = ({ style, children, ...props }) => (
  <Text style={[styles.label, style]} accessibilityRole="text" {...props}>
    {children}
  </Text>
);

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111',
    marginBottom: 4
  }
});
import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

export const Input: React.FC<TextInputProps> = (props) => {
  return (
    <TextInput
      style={[styles.input, props.style]}
      placeholderTextColor="#9ca3af"
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#111',
    marginVertical: 4
  }
});
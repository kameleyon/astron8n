import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

export const Textarea: React.FC<TextInputProps> = (props) => {
  return (
    <TextInput
      style={[styles.textarea, props.style]}
      placeholderTextColor="#9ca3af"
      multiline
      numberOfLines={props.numberOfLines || 4}
      textAlignVertical="top"
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  textarea: {
    minHeight: 80,
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: '#111',
    marginVertical: 4
  }
});
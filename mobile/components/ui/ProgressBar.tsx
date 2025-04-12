import React from 'react';
import { View, StyleSheet } from 'react-native';

interface ProgressBarProps {
  value: number; // Value should be between 0 and 100
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => {
  return (
    <View style={styles.background}>
      <View style={[styles.bar, { width: `${Math.max(0, Math.min(100, value))}%` }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    width: '100%',
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    height: 12,
    overflow: 'hidden'
  },
  bar: {
    backgroundColor: '#0d0630',
    height: 12,
    borderRadius: 8
  }
});

export default ProgressBar;
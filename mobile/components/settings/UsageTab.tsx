import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

export const UsageTab: React.FC = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Usage</Text>
    <Text style={styles.text}>Credit usage details will be displayed here.</Text>
    {/* TODO: Implement credit info display */}
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8
  },
  text: {
    fontSize: 14,
    color: Colors.text
  }
});
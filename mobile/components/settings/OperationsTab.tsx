import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

export const OperationsTab: React.FC = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Settings</Text>
    <Text style={styles.text}>Account settings and operations will be available here.</Text>
    {/* TODO: Implement account settings options */}
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
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

export const BillingTab: React.FC = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Billing</Text>
    <Text style={styles.text}>Billing information and history will be displayed here.</Text>
    {/* TODO: Implement billing info display */}
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
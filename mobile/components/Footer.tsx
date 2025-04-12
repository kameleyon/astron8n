import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Footer: React.FC = () => (
  <View style={styles.footer}>
    <Text style={styles.text}>© {new Date().getFullYear()} agai. All rights reserved.</Text>
  </View>
);

const styles = StyleSheet.create({
  footer: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center'
  },
  text: {
    fontSize: 14,
    color: '#6b7280'
  }
});

export default Footer;
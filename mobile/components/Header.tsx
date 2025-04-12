import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from './ui/Button';

interface HeaderProps {
  onAuth?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAuth }) => (
  <View style={styles.header}>
    <Text style={styles.title}>agai</Text>
    {onAuth && (
      <Button variant="link" onPress={onAuth} style={styles.authButton}>
        Login / Signup
      </Button>
    )}
  </View>
);

const styles = StyleSheet.create({
  header: {
    width: '100%',
    paddingTop: 32,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#e5e7eb'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb'
  },
  authButton: {
    paddingHorizontal: 0
  }
});

export default Header;
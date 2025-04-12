import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ChatInterfaceindex: React.FC = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Chat with agai</Text>
    <View style={styles.chatBox}>
      <Text style={styles.placeholder}>Chat interface coming soon...</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 24,
    paddingHorizontal: 16,
    width: '100%'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 8
  },
  chatBox: {
    width: '100%',
    minHeight: 120,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16
  },
  placeholder: {
    color: '#6b7280',
    fontSize: 16
  }
});

export default ChatInterfaceindex;
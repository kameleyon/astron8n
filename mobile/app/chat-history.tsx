import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ChatHistoryScreen: React.FC = () => (
  <View style={styles.root}>
    <Header />
    <View style={styles.content}>
      <Text style={styles.title}>My Chat History</Text>
      <Text style={styles.paragraph}>
        View and manage your previous chat sessions here.
      </Text>
      {/* TODO: Integrate chat session listing and Supabase data */}
    </View>
    <Footer />
  </View>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff'
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 12,
    textAlign: 'center'
  },
  paragraph: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center'
  }
});

export default ChatHistoryScreen;
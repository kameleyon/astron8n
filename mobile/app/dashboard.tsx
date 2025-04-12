import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatInterfaceindex from '../components/ChatInterfaceindex';

const DashboardScreen: React.FC = () => (
  <View style={styles.root}>
    <Header />
    <View style={styles.content}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.paragraph}>
        Interact with agai and explore your insights.
      </Text>
      {/* TODO: Implement auth check, acknowledgment modal, birth chart modal */}
      <ChatInterfaceindex />
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
    justifyContent: 'flex-start', // Align content to top
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
    textAlign: 'center',
    marginBottom: 24
  }
});

export default DashboardScreen;
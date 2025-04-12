import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Colors from '../constants/Colors';

const TestScreen: React.FC = () => (
  <View style={styles.root}>
    <Header />
    <View style={styles.content}>
      <Text style={styles.title}>Test Screen</Text>
      <Text style={styles.paragraph}>
        This screen is used for testing purposes.
      </Text>
      {/* TODO: Implement fetching and rendering of test data (e.g., birth chart) */}
    </View>
    <Footer />
  </View>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background
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
    color: Colors.primary,
    marginBottom: 12,
    textAlign: 'center'
  },
  paragraph: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center'
  }
});

export default TestScreen;
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';

const BillingScreen: React.FC = () => (
  <View style={styles.root}>
    <Header />
    <View style={styles.content}>
      <Text style={styles.title}>Billing & Subscription</Text>
      <Text style={styles.paragraph}>
        Manage your subscription and payment details here.
      </Text>
      {/* TODO: Integrate subscription and payment components */}
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

export default BillingScreen;
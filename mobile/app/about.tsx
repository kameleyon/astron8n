import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AboutScreen: React.FC = () => (
  <View style={styles.root}>
    <Header />
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.section}>
        <Text style={styles.title}>About agai</Text>
        <Text style={styles.paragraph}>
          agai is a proud women-owned venture revolutionizing the world of astrology through cutting-edge AI technology. Our mission is to make accurate astrological insights accessible to everyone, combining ancient wisdom with modern innovation to deliver precise predictions and personalized guidance at unprecedented speed. As pioneers in AI-powered astrology, we're committed to breaking down barriers and making professional-grade astrological insights available to historically underserved communities, with a special focus on supporting and empowering Black-owned businesses and women entrepreneurs.
        </Text>
      </View>
      <View style={styles.featuresRow}>
        <View style={styles.feature}>
          {/* TODO: Add icon */}
          <Text style={styles.featureTitle}>Inclusive Platform</Text>
          <Text style={styles.featureDesc}>
            Built with diversity and inclusion at its core, ensuring accurate predictions for all communities.
          </Text>
        </View>
        <View style={styles.feature}>
          {/* TODO: Add icon */}
          <Text style={styles.featureTitle}>Lightning Fast</Text>
          <Text style={styles.featureDesc}>
            Lightning-fast calculations and instant insights powered by advanced AI technology.
          </Text>
        </View>
        <View style={styles.feature}>
          {/* TODO: Add icon */}
          <Text style={styles.featureTitle}>Cultural Wisdom</Text>
          <Text style={styles.featureDesc}>
            Culturally-informed guidance combining multiple astrological traditions.
          </Text>
        </View>
      </View>
      {/* TODO: Implement LegalAccordion for Terms of Service and Privacy Policy */}
    </ScrollView>
    <Footer />
  </View>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff'
  },
  scroll: {
    padding: 20,
    alignItems: 'center'
  },
  section: {
    marginBottom: 32,
    width: '100%'
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 12,
    textAlign: 'center'
  },
  paragraph: {
    fontSize: 16,
    color: '#444',
    marginBottom: 16,
    textAlign: 'center'
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 32
  },
  feature: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 6
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 4,
    textAlign: 'center'
  },
  featureDesc: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center'
  }
});

export default AboutScreen;
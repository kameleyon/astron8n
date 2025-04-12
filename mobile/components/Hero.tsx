import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from './ui/Button';

interface HeroProps {
  onAuth?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onAuth }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Welcome to agai</Text>
    <Text style={styles.subtitle}>
      Your AI-powered astrology and self-discovery companion. Chat, explore, and unlock your cosmic blueprint.
    </Text>
    {onAuth && (
      <Button variant="default" size="lg" onPress={onAuth} style={styles.button}>
        Get Started
      </Button>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 32,
    paddingHorizontal: 16
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 12,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
    textAlign: 'center'
  },
  button: {
    marginTop: 8
  }
});

export default Hero;
import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import Colors from '@/constants/Colors';

export default function ProfileScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="person.fill"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Profile</ThemedText>
        
        <ThemedView style={styles.card}>
          <ThemedText type="subtitle">Personal Information</ThemedText>
          <ThemedText>View and edit your personal details and birth information.</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.card}>
          <ThemedText type="subtitle">Birth Chart</ThemedText>
          <ThemedText>View your detailed astrological birth chart and analysis.</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.card}>
          <ThemedText type="subtitle">Saved Reports</ThemedText>
          <ThemedText>Access your saved astrological reports and readings.</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.card}>
          <ThemedText type="subtitle">Subscription</ThemedText>
          <ThemedText>Manage your subscription and payment details.</ThemedText>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    gap: 8
  },
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  }
});
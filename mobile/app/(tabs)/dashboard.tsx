import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import Colors from '@/constants/Colors';

export default function DashboardScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chart.bar.fill"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Dashboard</ThemedText>
        
        <ThemedView style={styles.card}>
          <ThemedText type="subtitle">Your Insights</ThemedText>
          <ThemedText>View your personalized astrological insights and predictions.</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.card}>
          <ThemedText type="subtitle">Recent Activity</ThemedText>
          <ThemedText>Check your recent chat sessions and reports.</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.card}>
          <ThemedText type="subtitle">Upcoming Transits</ThemedText>
          <ThemedText>See important astrological events coming up.</ThemedText>
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
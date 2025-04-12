import React from 'react';
import { StyleSheet, Switch } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import Colors from '@/constants/Colors';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);
  const [locationEnabled, setLocationEnabled] = React.useState(true);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#E0E0E0', dark: '#2D2D2D' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="gear"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Settings</ThemedText>
        
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">App Preferences</ThemedText>
          
          <ThemedView style={styles.settingRow}>
            <ThemedText>Dark Mode</ThemedText>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: Colors.muted, true: Colors.primary }}
              thumbColor={Colors.background}
            />
          </ThemedView>
          
          <ThemedView style={styles.settingRow}>
            <ThemedText>Notifications</ThemedText>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: Colors.muted, true: Colors.primary }}
              thumbColor={Colors.background}
            />
          </ThemedView>
          
          <ThemedView style={styles.settingRow}>
            <ThemedText>Location Services</ThemedText>
            <Switch
              value={locationEnabled}
              onValueChange={setLocationEnabled}
              trackColor={{ false: Colors.muted, true: Colors.primary }}
              thumbColor={Colors.background}
            />
          </ThemedView>
        </ThemedView>
        
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Account</ThemedText>
          
          <ThemedView style={styles.card}>
            <ThemedText>Profile Information</ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.card}>
            <ThemedText>Change Password</ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.card}>
            <ThemedText>Subscription Management</ThemedText>
          </ThemedView>
        </ThemedView>
        
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Support</ThemedText>
          
          <ThemedView style={styles.card}>
            <ThemedText>Help Center</ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.card}>
            <ThemedText>Contact Support</ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.card}>
            <ThemedText>Privacy Policy</ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.card}>
            <ThemedText>Terms of Service</ThemedText>
          </ThemedView>
        </ThemedView>
        
        <ThemedView style={[styles.card, styles.logoutButton]}>
          <ThemedText style={styles.logoutText}>Log Out</ThemedText>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 24
  },
  section: {
    gap: 12
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  logoutButton: {
    backgroundColor: Colors.destructive,
    alignItems: 'center',
    marginTop: 16
  },
  logoutText: {
    color: Colors.destructiveForeground,
    fontWeight: 'bold'
  },
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  }
});
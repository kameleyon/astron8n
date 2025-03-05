import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Switch,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Card, Button, Input } from '../components/ui';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { supabase } from '../supabase';

const SettingsScreen = () => {
  // Notification settings
  const [dailyHoroscope, setDailyHoroscope] = useState(true);
  const [transitAlerts, setTransitAlerts] = useState(true);
  const [specialOffers, setSpecialOffers] = useState(false);
  
  // Appearance settings
  const [darkMode, setDarkMode] = useState(false);
  const [largeText, setLargeText] = useState(false);
  
  // Privacy settings
  const [locationServices, setLocationServices] = useState(true);
  const [analyticsTracking, setAnalyticsTracking] = useState(true);
  
  // Password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  
  const handleChangePassword = async () => {
    // Validate password inputs
    const errors: Record<string, string> = {};
    
    if (!currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!newPassword) {
      errors.newPassword = 'New password is required';
    } else if (newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setPasswordErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return;
    }
    
    try {
      // In a real app, this would call your API to change the password
      // For now, we'll just simulate a success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Success',
        'Your password has been updated successfully.',
        [{ text: 'OK' }]
      );
      
      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      Alert.alert('Error', 'Failed to change password. Please try again.');
    }
  };
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      // Navigate to login screen would happen here
      Alert.alert('Success', 'You have been logged out successfully.');
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };
  
  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              // In a real app, this would call your API to delete the account
              // For now, we'll just simulate a success
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              Alert.alert(
                'Account Deleted',
                'Your account has been successfully deleted.',
                [{ text: 'OK' }]
              );
              
              // Navigate to login screen would happen here
            } catch (error) {
              console.error('Error deleting account:', error);
              Alert.alert('Error', 'Failed to delete account. Please try again.');
            }
          }
        }
      ]
    );
  };
  
  const renderSettingItem = (
    title: string, 
    description: string, 
    value: boolean, 
    onValueChange: (value: boolean) => void
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingTextContainer}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#e0e0e0', true: '#f4511e' }}
        thumbColor="#fff"
      />
    </View>
  );
  
  return (
    <ScrollView style={styles.container}>
      <Card title="Notifications" style={styles.card}>
        {renderSettingItem(
          'Daily Horoscope',
          'Receive your daily horoscope every morning',
          dailyHoroscope,
          setDailyHoroscope
        )}
        
        {renderSettingItem(
          'Transit Alerts',
          'Get notified about important planetary transits',
          transitAlerts,
          setTransitAlerts
        )}
        
        {renderSettingItem(
          'Special Offers',
          'Receive notifications about promotions and special offers',
          specialOffers,
          setSpecialOffers
        )}
      </Card>
      
      <Card title="Appearance" style={styles.card}>
        {renderSettingItem(
          'Dark Mode',
          'Use dark theme throughout the app',
          darkMode,
          setDarkMode
        )}
        
        {renderSettingItem(
          'Large Text',
          'Increase text size for better readability',
          largeText,
          setLargeText
        )}
      </Card>
      
      <Card title="Privacy" style={styles.card}>
        {renderSettingItem(
          'Location Services',
          'Allow the app to access your location for more accurate readings',
          locationServices,
          setLocationServices
        )}
        
        {renderSettingItem(
          'Analytics',
          'Help us improve by sending anonymous usage data',
          analyticsTracking,
          setAnalyticsTracking
        )}
      </Card>
      
      <Card title="Change Password" style={styles.card}>
        <Input
          label="Current Password"
          placeholder="Enter your current password"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
          error={passwordErrors.currentPassword}
        />
        
        <Input
          label="New Password"
          placeholder="Enter your new password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          error={passwordErrors.newPassword}
        />
        
        <Input
          label="Confirm New Password"
          placeholder="Confirm your new password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          error={passwordErrors.confirmPassword}
        />
        
        <Button
          title="Change Password"
          onPress={handleChangePassword}
          style={styles.changePasswordButton}
        />
      </Card>
      
      <Card title="Account" style={styles.card}>
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="outline"
          style={styles.logoutButton}
        />
        
        <Button
          title="Delete Account"
          onPress={handleDeleteAccount}
          variant="outline"
          style={styles.deleteAccountButton}
          textStyle={{ color: '#f44336' }}
        />
      </Card>
      
      <View style={styles.aboutSection}>
        <Text style={styles.appVersion}>AstroGenie v1.0.0</Text>
        <Text style={styles.copyright}>© 2025 AstroGenie. All rights reserved.</Text>
        
        <View style={styles.linksContainer}>
          <TouchableOpacity style={styles.link}>
            <Text style={styles.linkText}>Privacy Policy</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.link}>
            <Text style={styles.linkText}>Terms of Service</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#757575',
  },
  changePasswordButton: {
    marginTop: 16,
  },
  logoutButton: {
    marginBottom: 16,
  },
  deleteAccountButton: {
    borderColor: '#f44336',
  },
  aboutSection: {
    alignItems: 'center',
    padding: 24,
    marginTop: 16,
    marginBottom: 32,
  },
  appVersion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  copyright: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 16,
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  link: {
    marginHorizontal: 8,
    padding: 8,
  },
  linkText: {
    fontSize: 14,
    color: '#2196F3',
  },
});

export default SettingsScreen;

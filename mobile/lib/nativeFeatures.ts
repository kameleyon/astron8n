import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Sharing from 'expo-sharing';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Image Picker
export async function requestCameraPermission() {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  return status === 'granted';
}

export async function requestMediaLibraryPermission() {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return status === 'granted';
}

export async function pickImage(useCamera = false) {
  try {
    let result;
    
    if (useCamera) {
      const permissionGranted = await requestCameraPermission();
      if (!permissionGranted) {
        throw new Error('Camera permission not granted');
      }
      
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
    } else {
      const permissionGranted = await requestMediaLibraryPermission();
      if (!permissionGranted) {
        throw new Error('Media library permission not granted');
      }
      
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
    }
    
    if (!result.canceled) {
      return result.assets[0].uri;
    }
    
    return null;
  } catch (error) {
    console.error('Error picking image:', error);
    throw error;
  }
}

// Location
export async function requestLocationPermission() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
}

export async function getCurrentLocation() {
  try {
    const permissionGranted = await requestLocationPermission();
    if (!permissionGranted) {
      throw new Error('Location permission not granted');
    }
    
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error('Error getting location:', error);
    throw error;
  }
}

export async function geocodeLocation(address: string) {
  try {
    const locations = await Location.geocodeAsync(address);
    if (locations.length > 0) {
      return {
        latitude: locations[0].latitude,
        longitude: locations[0].longitude,
      };
    }
    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    throw error;
  }
}

export async function reverseGeocodeLocation(latitude: number, longitude: number) {
  try {
    const addresses = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });
    
    if (addresses.length > 0) {
      return addresses[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    throw error;
  }
}

// Sharing
export async function shareContent(content: string, dialogTitle = 'Share with') {
  try {
    if (!(await Sharing.isAvailableAsync())) {
      throw new Error('Sharing is not available on this device');
    }
    
    // For sharing text, we need to create a temporary file on some platforms
    const shareOptions = {
      dialogTitle,
      message: content,
    };
    
    // Use the appropriate sharing method based on the platform
    if (Platform.OS === 'web') {
      // Web sharing
      if (navigator.share) {
        await navigator.share({
          text: content,
        });
      } else {
        throw new Error('Web sharing not supported in this browser');
      }
    } else {
      // Native sharing
      await Sharing.shareAsync(content);
    }
    
    return true;
  } catch (error) {
    console.error('Error sharing content:', error);
    throw error;
  }
}

// Notifications
export async function requestNotificationPermission() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleLocalNotification(
  title: string,
  body: string,
  trigger: Notifications.NotificationTriggerInput = null
) {
  try {
    const permissionGranted = await requestNotificationPermission();
    if (!permissionGranted) {
      throw new Error('Notification permission not granted');
    }
    
    // Configure notification behavior
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
    
    // Schedule the notification
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
      },
      trigger,
    });
    
    return notificationId;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    throw error;
  }
}

export async function cancelAllNotifications() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    return true;
  } catch (error) {
    console.error('Error canceling notifications:', error);
    throw error;
  }
}
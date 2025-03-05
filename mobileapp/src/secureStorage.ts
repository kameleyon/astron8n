import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// For web, we'll use localStorage as a fallback
const isWeb = Platform.OS === 'web';

// Mock storage for web
const webStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.error('Error accessing localStorage:', e);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.error('Error setting localStorage:', e);
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Error removing from localStorage:', e);
    }
  }
};

export async function saveSecureToken(key: string, value: string) {
  if (isWeb) {
    webStorage.setItem(key, value);
    console.log(`Token saved to localStorage: ${key}`);
    return;
  }

  try {
    await SecureStore.setItemAsync(key, value);
    console.log(`Secure token saved: ${key}`);
  } catch (error) {
    console.error('Error saving secure token:', error);
    // Fallback to localStorage even on native if SecureStore fails
    webStorage.setItem(key, value);
  }
}

export async function getSecureToken(key: string): Promise<string | null> {
  if (isWeb) {
    const value = webStorage.getItem(key);
    if (value) {
      console.log(`Token retrieved from localStorage: ${key}`);
      return value;
    }
    console.log(`No token found in localStorage for key: ${key}`);
    return null;
  }

  try {
    const result = await SecureStore.getItemAsync(key);
    if (result) {
      console.log(`Secure token retrieved: ${key}`);
      return result;
    } else {
      console.log(`No secure token found for key: ${key}`);
      return null;
    }
  } catch (error) {
    console.error('Error retrieving secure token:', error);
    // Fallback to localStorage even on native if SecureStore fails
    return webStorage.getItem(key);
  }
}

export async function deleteSecureToken(key: string) {
  if (isWeb) {
    webStorage.removeItem(key);
    console.log(`Token removed from localStorage: ${key}`);
    return;
  }

  try {
    await SecureStore.deleteItemAsync(key);
    console.log(`Secure token deleted: ${key}`);
  } catch (error) {
    console.error('Error deleting secure token:', error);
    // Fallback to localStorage even on native if SecureStore fails
    webStorage.removeItem(key);
  }
}

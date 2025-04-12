import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveItem(key: string, value: string) {
  await AsyncStorage.setItem(key, value);
}

export async function getItem(key: string): Promise<string | null> {
  return await AsyncStorage.getItem(key);
}

export async function deleteItem(key: string) {
  await AsyncStorage.removeItem(key);
}
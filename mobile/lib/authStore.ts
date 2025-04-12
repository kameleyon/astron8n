import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';

export async function saveAuthToken(token: string) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getAuthToken(): Promise<string | null> {
  return await SecureStore.getItemAsync(TOKEN_KEY);
}

export async function deleteAuthToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}
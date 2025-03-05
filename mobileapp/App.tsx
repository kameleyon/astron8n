import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, Platform } from 'react-native';
import { RootStackParamList } from './src/types';
import { supabase } from './src/supabase';
import { getSecureToken } from './src/secureStorage';
import LoginScreen from './LoginScreen';
import RegistrationScreen from './RegistrationScreen';
import PasswordResetScreen from './PasswordResetScreen';
import ProfileScreen from './ProfileScreen';
import MainTabNavigator from './src/navigation/MainTabNavigator';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session);
        setIsLoading(false);
      }
    );

    // Load session on startup
    loadSession();

    // Clean up subscription
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const loadSession = async () => {
    try {
      // Check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setIsAuthenticated(true);
      } else {
        // Try to restore session from secure storage
        const token = await getSecureToken('supabase_session_token');
        
        if (token) {
          const { error } = await supabase.auth.setSession({
            access_token: token,
            refresh_token: '',
          });
          
          if (!error) {
            setIsAuthenticated(true);
          }
        }
      }
    } catch (error) {
      console.error('Error loading session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    // You could show a splash screen or loading indicator here
    return null;
  }

  return (
    <NavigationContainer>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#f4511e" 
      />
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {isAuthenticated ? (
          // Authenticated routes
          <>
            <Stack.Screen 
              name="MainTabs" 
              component={MainTabNavigator} 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Profile" 
              component={ProfileScreen} 
              options={{ title: 'Profile' }}
            />
          </>
        ) : (
          // Authentication routes
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ title: 'Login' }}
            />
            <Stack.Screen 
              name="Register" 
              component={RegistrationScreen} 
              options={{ title: 'Create Account' }}
            />
            <Stack.Screen 
              name="PasswordReset" 
              component={PasswordResetScreen} 
              options={{ title: 'Reset Password' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

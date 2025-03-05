import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './src/types';
import { supabase } from './src/supabase';
import { saveSecureToken } from './src/secureStorage';
import { ERROR_MESSAGES } from './src/shared';

// Define the navigation prop type
type RegistrationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

export default function RegistrationScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<RegistrationScreenNavigationProp>();

  const handleRegistration = async () => {
    // Validate inputs
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        console.error('Registration error:', error);
        Alert.alert('Registration Failed', error.message || ERROR_MESSAGES.AUTHENTICATION_ERROR);
        return;
      }

      if (data?.session) {
        // Store session token securely
        await saveSecureToken('supabase_session_token', data.session.access_token);
        console.log('Session token stored securely');
        
        // Navigate to Home screen
        navigation.navigate('Home');
      } else {
        // Email confirmation required
        Alert.alert(
          'Registration Successful', 
          'Please check your email to verify your account.',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
        );
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', ERROR_MESSAGES.UNKNOWN_ERROR);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <Button 
        title={loading ? "Registering..." : "Register"} 
        onPress={handleRegistration} 
        disabled={loading}
      />
      <View style={styles.loginContainer}>
        <Text>Already have an account? </Text>
        <Button 
          title="Login" 
          onPress={() => navigation.navigate('Login')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
});

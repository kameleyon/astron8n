import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './src/types';
import { supabase } from './src/supabase';
import { ERROR_MESSAGES } from './src/shared';

type PasswordResetScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PasswordReset'>;

export default function PasswordResetScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const navigation = useNavigation<PasswordResetScreenNavigationProp>();

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'astrogenie://reset-password-callback',
      });

      if (error) {
        console.error('Password reset error:', error);
        Alert.alert('Password Reset Failed', error.message || ERROR_MESSAGES.AUTHENTICATION_ERROR);
        return;
      }

      setResetSent(true);
      Alert.alert(
        'Password Reset Email Sent',
        'Please check your email for instructions to reset your password.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Password reset error:', error);
      Alert.alert('Error', ERROR_MESSAGES.UNKNOWN_ERROR);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      
      {!resetSent ? (
        <>
          <Text style={styles.instructions}>
            Enter your email address and we'll send you instructions to reset your password.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
          <Button 
            title={loading ? "Sending..." : "Send Reset Instructions"} 
            onPress={handlePasswordReset} 
            disabled={loading}
          />
        </>
      ) : (
        <>
          <Text style={styles.successMessage}>
            Password reset email sent! Check your inbox for instructions.
          </Text>
          <Text style={styles.instructions}>
            If you don't see the email, check your spam folder.
          </Text>
        </>
      )}
      
      <View style={styles.backContainer}>
        <Button 
          title="Back to Login" 
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
  instructions: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  successMessage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
    textAlign: 'center',
    marginBottom: 10,
  },
  backContainer: {
    marginTop: 30,
  },
});

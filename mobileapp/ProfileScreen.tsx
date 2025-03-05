import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  Button, 
  Alert, 
  ScrollView, 
  ActivityIndicator,
  TouchableOpacity,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './src/types';
import { supabase } from './src/supabase';
import { ERROR_MESSAGES, UserProfile, isValidDate, isValidTime } from './src/shared';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthLocation, setBirthLocation] = useState('');
  const [timezone, setTimezone] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error(userError?.message || 'User not found');
      }
      
      // Get user profile
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
      
      if (data) {
        setProfile(data as UserProfile);
        setFullName(data.full_name || '');
        setBirthDate(data.birth_date || '');
        setBirthTime(data.birth_time || '');
        setBirthLocation(data.birth_location || '');
        setTimezone(data.timezone || '');
        setEmail(user.email || '');
        
        // Get avatar URL if exists
        if (data.avatar_url) {
          const { data: avatarData } = await supabase.storage
            .from('avatars')
            .getPublicUrl(data.avatar_url);
            
          if (avatarData) {
            setAvatarUrl(avatarData.publicUrl);
          }
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!fullName) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    // Validate date and time if provided
    if (birthDate && !isValidDate(birthDate)) {
      Alert.alert('Error', ERROR_MESSAGES.INVALID_DATE);
      return;
    }

    if (birthTime && !isValidTime(birthTime)) {
      Alert.alert('Error', ERROR_MESSAGES.INVALID_TIME);
      return;
    }

    try {
      setSaving(true);
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error(userError?.message || 'User not found');
      }
      
      const updates = {
        id: user.id,
        full_name: fullName,
        birth_date: birthDate,
        birth_time: birthTime,
        birth_location: birthLocation,
        timezone: timezone,
        updated_at: new Date().toISOString(),
      };
      
      const { error } = await supabase
        .from('user_profiles')
        .upsert(updates);
      
      if (error) {
        throw error;
      }
      
      Alert.alert('Success', 'Profile updated successfully');
      await fetchProfile(); // Refresh profile data
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePickImage = async () => {
    try {
      // Request permissions
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please grant camera roll permissions to upload an image');
        return;
      }
      
      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        await uploadImage(selectedImage.uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const uploadImage = async (uri: string) => {
    try {
      setUploadingImage(true);
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error(userError?.message || 'User not found');
      }
      
      // Get file info
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        throw new Error('File does not exist');
      }
      
      // Read file as base64
      const fileBase64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      // Convert to Blob
      const blob = Buffer.from(fileBase64, 'base64');
      
      // Generate unique filename
      const fileExt = uri.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, blob, {
          contentType: `image/${fileExt}`,
          upsert: true,
        });
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Update user profile with avatar URL
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ avatar_url: filePath })
        .eq('id', user.id);
      
      if (updateError) {
        throw updateError;
      }
      
      // Get public URL
      const { data } = await supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      setAvatarUrl(data.publicUrl);
      Alert.alert('Success', 'Profile picture updated');
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>
      
      <View style={styles.avatarContainer}>
        {uploadingImage ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarPlaceholderText}>
                  {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
                </Text>
              </View>
            )}
            <TouchableOpacity 
              style={styles.changeAvatarButton}
              onPress={handlePickImage}
            >
              <Text style={styles.changeAvatarText}>Change Photo</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      
      <View style={styles.formContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={email}
          editable={false}
        />
        
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter your full name"
        />
        
        <Text style={styles.label}>Birth Date</Text>
        <TextInput
          style={styles.input}
          value={birthDate}
          onChangeText={setBirthDate}
          placeholder="YYYY-MM-DD"
        />
        
        <Text style={styles.label}>Birth Time</Text>
        <TextInput
          style={styles.input}
          value={birthTime || ''}
          onChangeText={setBirthTime}
          placeholder="HH:MM (24-hour format)"
        />
        
        <Text style={styles.label}>Birth Location</Text>
        <TextInput
          style={styles.input}
          value={birthLocation || ''}
          onChangeText={setBirthLocation}
          placeholder="City, Country"
        />
        
        <Text style={styles.label}>Timezone</Text>
        <TextInput
          style={styles.input}
          value={timezone}
          onChangeText={setTimezone}
          placeholder="e.g., America/New_York"
        />
        
        <Button
          title={saving ? "Saving..." : "Save Profile"}
          onPress={handleSaveProfile}
          disabled={saving}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#555',
  },
  changeAvatarButton: {
    marginTop: 10,
  },
  changeAvatarText: {
    color: '#0000EE',
    fontSize: 16,
  },
  formContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
  },
});

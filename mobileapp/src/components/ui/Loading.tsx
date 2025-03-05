import React from 'react';
import { 
  View, 
  ActivityIndicator, 
  Text, 
  StyleSheet, 
  Modal, 
  ViewStyle 
} from 'react-native';

interface LoadingProps {
  loading: boolean;
  message?: string;
  overlay?: boolean;
  size?: 'small' | 'large';
  color?: string;
  backgroundColor?: string;
  textColor?: string;
  style?: ViewStyle;
}

const Loading: React.FC<LoadingProps> = ({
  loading,
  message,
  overlay = false,
  size = 'large',
  color = '#f4511e',
  backgroundColor = 'rgba(255, 255, 255, 0.9)',
  textColor = '#333',
  style,
}) => {
  if (!loading) {
    return null;
  }

  const loadingContent = (
    <View style={[
      styles.container, 
      { backgroundColor },
      overlay ? styles.overlay : null,
      style
    ]}>
      <ActivityIndicator size={size} color={color} />
      {message && (
        <Text style={[styles.message, { color: textColor }]}>
          {message}
        </Text>
      )}
    </View>
  );

  if (overlay) {
    return (
      <Modal
        transparent
        animationType="fade"
        visible={loading}
      >
        {loadingContent}
      </Modal>
    );
  }

  return loadingContent;
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Loading;

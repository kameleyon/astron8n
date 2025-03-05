import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  ViewStyle, 
  TextStyle 
} from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const getButtonStyle = () => {
    let buttonStyle: ViewStyle[] = [styles.button];
    
    // Variant styles
    if (variant === 'primary') {
      buttonStyle.push(styles.primaryButton);
    } else if (variant === 'secondary') {
      buttonStyle.push(styles.secondaryButton);
    } else if (variant === 'outline') {
      buttonStyle.push(styles.outlineButton);
    }
    
    // Size styles
    if (size === 'small') {
      buttonStyle.push(styles.smallButton);
    } else if (size === 'large') {
      buttonStyle.push(styles.largeButton);
    }
    
    // Disabled style
    if (disabled) {
      buttonStyle.push(styles.disabledButton);
    }
    
    // Full width style
    if (fullWidth) {
      buttonStyle.push(styles.fullWidth);
    }
    
    return buttonStyle;
  };
  
  const getTextStyle = () => {
    let textStyleArray: TextStyle[] = [styles.buttonText];
    
    // Variant text styles
    if (variant === 'primary') {
      textStyleArray.push(styles.primaryButtonText);
    } else if (variant === 'secondary') {
      textStyleArray.push(styles.secondaryButtonText);
    } else if (variant === 'outline') {
      textStyleArray.push(styles.outlineButtonText);
    }
    
    // Size text styles
    if (size === 'small') {
      textStyleArray.push(styles.smallButtonText);
    } else if (size === 'large') {
      textStyleArray.push(styles.largeButtonText);
    }
    
    // Disabled text style
    if (disabled) {
      textStyleArray.push(styles.disabledButtonText);
    }
    
    return textStyleArray;
  };
  
  return (
    <TouchableOpacity
      style={[...getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' ? '#f4511e' : '#ffffff'} 
        />
      ) : (
        <Text style={[...getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    minWidth: 120,
  },
  primaryButton: {
    backgroundColor: '#f4511e',
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#f4511e',
  },
  smallButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 80,
  },
  largeButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    minWidth: 160,
  },
  disabledButton: {
    backgroundColor: '#e0e0e0',
    borderColor: '#e0e0e0',
  },
  fullWidth: {
    width: '100%',
  },
  buttonText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
  },
  secondaryButtonText: {
    color: '#ffffff',
  },
  outlineButtonText: {
    color: '#f4511e',
  },
  smallButtonText: {
    fontSize: 12,
  },
  largeButtonText: {
    fontSize: 18,
  },
  disabledButtonText: {
    color: '#9e9e9e',
  },
});

export default Button;

import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar, 
  Platform,
  ViewStyle,
  TextStyle
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

interface HeaderProps {
  title: string;
  leftIcon?: string;
  rightIcon?: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  showBackButton?: boolean;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  backgroundColor?: string;
  elevation?: number;
}

const Header: React.FC<HeaderProps> = ({
  title,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  showBackButton = false,
  style,
  titleStyle,
  backgroundColor = '#f4511e',
  elevation = 4,
}) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (onLeftPress) {
      onLeftPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={[
      styles.header, 
      { backgroundColor, elevation },
      Platform.OS === 'ios' && { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 2 },
      style
    ]}>
      <StatusBar 
        backgroundColor={backgroundColor} 
        barStyle="light-content" 
      />
      
      <View style={styles.leftContainer}>
        {(showBackButton || leftIcon) && (
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={handleBackPress}
          >
            <Icon 
              name={showBackButton ? 'arrow-back' : leftIcon || 'menu'} 
              size={24} 
              color="#fff" 
            />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.titleContainer}>
        <Text style={[styles.title, titleStyle]} numberOfLines={1}>
          {title}
        </Text>
      </View>
      
      <View style={styles.rightContainer}>
        {rightIcon && (
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={onRightPress}
          >
            <Icon name={rightIcon} size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56 + STATUSBAR_HEIGHT,
    paddingTop: STATUSBAR_HEIGHT,
    paddingHorizontal: 16,
  },
  leftContainer: {
    width: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  iconButton: {
    padding: 8,
  },
});

export default Header;

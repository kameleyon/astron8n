import React from 'react';
import { 
  View, 
  StyleSheet, 
  ViewStyle, 
  TouchableOpacity, 
  Text,
  StyleProp
} from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  title?: string;
  subtitle?: string;
  elevation?: number;
  bordered?: boolean;
  rounded?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  title,
  subtitle,
  elevation = 2,
  bordered = false,
  rounded = true,
}) => {
  const cardStyle = [
    styles.card,
    rounded && styles.rounded,
    bordered && styles.bordered,
    { elevation },
    style,
  ];

  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent 
      style={cardStyle} 
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {(title || subtitle) && (
        <View style={styles.headerContainer}>
          {title && <Text style={styles.title}>{title}</Text>}
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      )}
      <View style={styles.contentContainer}>
        {children}
      </View>
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  rounded: {
    borderRadius: 8,
  },
  bordered: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  headerContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#757575',
  },
});

export default Card;

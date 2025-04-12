import React from 'react';
import { View, Text, StyleSheet, ViewProps, TextProps } from 'react-native';

export const Card: React.FC<ViewProps> = ({ style, children, ...props }) => (
  <View style={[styles.card, style]} {...props}>
    {children}
  </View>
);

export const CardHeader: React.FC<ViewProps> = ({ style, children, ...props }) => (
  <View style={[styles.header, style]} {...props}>
    {children}
  </View>
);

export const CardTitle: React.FC<TextProps> = ({ style, children, ...props }) => (
  <Text style={[styles.title, style]} {...props}>
    {children}
  </Text>
);

export const CardDescription: React.FC<TextProps> = ({ style, children, ...props }) => (
  <Text style={[styles.description, style]} {...props}>
    {children}
  </Text>
);

export const CardContent: React.FC<ViewProps> = ({ style, children, ...props }) => (
  <View style={[styles.content, style]} {...props}>
    {children}
  </View>
);

export const CardFooter: React.FC<ViewProps> = ({ style, children, ...props }) => (
  <View style={[styles.footer, style]} {...props}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    marginVertical: 8,
    marginHorizontal: 4,
    overflow: 'hidden'
  },
  header: {
    flexDirection: 'column',
    padding: 16,
    paddingBottom: 0
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 4
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4
  },
  content: {
    padding: 16,
    paddingTop: 0
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 0
  }
});
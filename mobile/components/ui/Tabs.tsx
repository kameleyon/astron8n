import React, { useState, ReactNode } from 'react';
import { View, Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface TabsProps {
  children: ReactNode;
  initialTab?: string;
}

interface TabsContextProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = React.createContext<TabsContextProps | undefined>(undefined);

export const Tabs: React.FC<TabsProps> = ({ children, initialTab }) => {
  const [activeTab, setActiveTab] = useState(initialTab || '');

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <View>{children}</View>
    </TabsContext.Provider>
  );
};

interface TabsListProps {
  children: ReactNode;
  style?: ViewStyle;
}

export const TabsList: React.FC<TabsListProps> = ({ children, style }) => (
  <View style={[styles.tabsList, style]}>{children}</View>
);

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children, style, textStyle }) => {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error('TabsTrigger must be used within Tabs');

  const isActive = ctx.activeTab === value;
  return (
    <Pressable
      style={[
        styles.trigger,
        isActive && styles.triggerActive,
        style
      ]}
      onPress={() => ctx.setActiveTab(value)}
    >
      <Text style={[styles.triggerText, isActive && styles.triggerTextActive, textStyle]}>
        {children}
      </Text>
    </Pressable>
  );
};

interface TabsContentProps {
  value: string;
  children: ReactNode;
  style?: ViewStyle;
}

export const TabsContent: React.FC<TabsContentProps> = ({ value, children, style }) => {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error('TabsContent must be used within Tabs');
  if (ctx.activeTab !== value) return null;
  return <View style={style}>{children}</View>;
};

const styles = StyleSheet.create({
  tabsList: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    marginVertical: 8
  },
  trigger: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'transparent'
  },
  triggerActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 }
  },
  triggerText: {
    fontSize: 16,
    color: '#6b7280'
  },
  triggerTextActive: {
    color: '#111',
    fontWeight: 'bold'
  }
});
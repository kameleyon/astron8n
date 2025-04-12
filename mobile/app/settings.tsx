import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { UsageTab } from '../components/settings/UsageTab';
import { BillingTab } from '../components/settings/BillingTab';
import { OperationsTab } from '../components/settings/OperationsTab';
import Colors from '../constants/Colors';

const SettingsScreen: React.FC = () => (
  <View style={styles.root}>
    <Header />
    <View style={styles.content}>
      <Text style={styles.pageTitle}>Settings</Text>
      {/* TODO: Implement data fetching for credit/billing info */}
      <Tabs initialTab="usage">
        <TabsList style={styles.tabsList}>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="usage">
          <UsageTab />
        </TabsContent>
        <TabsContent value="billing">
          <BillingTab />
        </TabsContent>
        <TabsContent value="settings">
          <OperationsTab />
        </TabsContent>
      </Tabs>
    </View>
    <Footer />
  </View>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background
  },
  content: {
    flex: 1,
    padding: 20
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 24
  },
  tabsList: {
    marginBottom: 16
  }
});

export default SettingsScreen;
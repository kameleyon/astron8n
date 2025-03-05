import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  FlatList
} from 'react-native';
import { Card, Button, Loading } from '../components/ui';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { supabase } from '../supabase';

// Mock data for reports
const REPORTS_DATA = [
  {
    id: '1',
    title: 'Personality Report',
    description: 'A comprehensive analysis of your personality traits based on your birth chart.',
    price: 5,
    icon: 'person',
    color: '#4CAF50',
    purchased: true,
    date: '2025-02-15',
  },
  {
    id: '2',
    title: 'Career Path Report',
    description: 'Discover your professional strengths and ideal career paths based on your astrological profile.',
    price: 10,
    icon: 'work',
    color: '#2196F3',
    purchased: false,
  },
  {
    id: '3',
    title: 'Love Compatibility',
    description: 'Analyze your romantic compatibility with a partner or potential match.',
    price: 8,
    icon: 'favorite',
    color: '#E91E63',
    purchased: false,
  },
  {
    id: '4',
    title: 'Year Ahead Forecast',
    description: 'A detailed forecast of the coming year with key dates and opportunities.',
    price: 15,
    icon: 'calendar-today',
    color: '#FF9800',
    purchased: true,
    date: '2025-03-01',
  },
  {
    id: '5',
    title: 'Natal Chart Deep Dive',
    description: 'An in-depth analysis of your complete birth chart with detailed interpretations.',
    price: 20,
    icon: 'explore',
    color: '#9C27B0',
    purchased: false,
  },
];

const ReportsScreen = () => {
  const [activeTab, setActiveTab] = useState('available'); // 'available' or 'purchased'
  const [reports, setReports] = useState(REPORTS_DATA);
  const [loading, setLoading] = useState(false);
  
  const availableReports = reports.filter(report => !report.purchased);
  const purchasedReports = reports.filter(report => report.purchased);
  
  const handlePurchaseReport = async (reportId: string) => {
    setLoading(true);
    
    try {
      // In a real app, this would call your payment API
      // For now, we'll just simulate a delay and update the state
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setReports(reports.map(report => 
        report.id === reportId 
          ? { ...report, purchased: true, date: new Date().toISOString().split('T')[0] } 
          : report
      ));
      
      // Switch to purchased tab after buying
      setActiveTab('purchased');
    } catch (error) {
      console.error('Error purchasing report:', error);
      // Handle error
    } finally {
      setLoading(false);
    }
  };
  
  const renderReportItem = ({ item }: { item: typeof REPORTS_DATA[0] }) => (
    <Card style={styles.reportCard}>
      <View style={styles.reportHeader}>
        <View style={[styles.reportIconContainer, { backgroundColor: item.color }]}>
          <Icon name={item.icon} size={24} color="#fff" />
        </View>
        <View style={styles.reportTitleContainer}>
          <Text style={styles.reportTitle}>{item.title}</Text>
          {item.purchased && (
            <Text style={styles.purchasedDate}>Purchased on {item.date}</Text>
          )}
        </View>
      </View>
      
      <Text style={styles.reportDescription}>{item.description}</Text>
      
      {item.purchased ? (
        <Button 
          title="View Report" 
          onPress={() => {}} 
          style={styles.reportButton}
        />
      ) : (
        <View style={styles.purchaseContainer}>
          <Text style={styles.priceText}>{item.price} Credits</Text>
          <Button 
            title="Purchase" 
            onPress={() => handlePurchaseReport(item.id)} 
            style={styles.reportButton}
          />
        </View>
      )}
    </Card>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'available' && styles.activeTab]}
          onPress={() => setActiveTab('available')}
        >
          <Text style={[styles.tabText, activeTab === 'available' && styles.activeTabText]}>
            Available Reports
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'purchased' && styles.activeTab]}
          onPress={() => setActiveTab('purchased')}
        >
          <Text style={[styles.tabText, activeTab === 'purchased' && styles.activeTabText]}>
            My Reports
          </Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'available' ? (
        availableReports.length > 0 ? (
          <FlatList
            data={availableReports}
            renderItem={renderReportItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="assignment" size={64} color="#bdbdbd" />
            <Text style={styles.emptyText}>No available reports</Text>
          </View>
        )
      ) : (
        purchasedReports.length > 0 ? (
          <FlatList
            data={purchasedReports}
            renderItem={renderReportItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="assignment" size={64} color="#bdbdbd" />
            <Text style={styles.emptyText}>You haven't purchased any reports yet</Text>
            <Button 
              title="Browse Available Reports" 
              onPress={() => setActiveTab('available')} 
              style={styles.browseButton}
            />
          </View>
        )
      )}
      
      <Loading loading={loading} overlay message="Processing your purchase..." />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#f4511e',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#757575',
  },
  activeTabText: {
    color: '#f4511e',
  },
  listContainer: {
    padding: 16,
  },
  reportCard: {
    marginBottom: 16,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reportIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reportTitleContainer: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  purchasedDate: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2,
  },
  reportDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  purchaseContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  reportButton: {
    minWidth: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  browseButton: {
    minWidth: 200,
  },
});

export default ReportsScreen;

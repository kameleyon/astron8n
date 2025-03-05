import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { Card, Button } from '../components/ui';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { supabase } from '../supabase';

// Mock data for dashboard
const USER_DATA = {
  name: 'Alex Johnson',
  credits: 25,
  subscription: 'Premium',
  subscriptionEndDate: '2025-04-15',
  birthChart: {
    sun: 'Leo',
    moon: 'Cancer',
    ascendant: 'Aries',
    lastViewed: '2025-03-02',
  },
  recentReports: [
    { id: '1', title: 'Personality Report', date: '2025-02-15' },
    { id: '4', title: 'Year Ahead Forecast', date: '2025-03-01' },
  ],
  dailyHoroscope: {
    sign: 'Leo',
    date: '2025-03-04',
    text: 'Today is a great day for creative pursuits. Your natural leadership abilities will shine through in group settings. Take time to appreciate the little things.',
    mood: 'Inspired',
    luckyNumber: 7,
    compatibility: 'Libra',
  },
  transitAlerts: [
    { 
      planet: 'Mercury', 
      event: 'Retrograde', 
      startDate: '2025-03-15', 
      endDate: '2025-04-05',
      impact: 'Communication challenges may arise. Double-check important messages and be patient with delays.'
    },
    {
      planet: 'Venus',
      event: 'Enters Leo',
      startDate: '2025-03-10',
      impact: 'A favorable time for romance and creative expression. Your charisma will be enhanced.'
    }
  ]
};

const DashboardScreen = () => {
  const [userData, setUserData] = useState(USER_DATA);
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfoContainer}>
          <Text style={styles.welcomeText}>Hello, {userData.name}</Text>
          <Text style={styles.dateText}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
        </View>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Icon name="stars" size={24} color="#f4511e" />
          <Text style={styles.statValue}>{userData.credits}</Text>
          <Text style={styles.statLabel}>Credits</Text>
        </View>
        
        <View style={styles.statCard}>
          <Icon name="verified" size={24} color="#4CAF50" />
          <Text style={styles.statValue}>{userData.subscription}</Text>
          <Text style={styles.statLabel}>Plan</Text>
        </View>
        
        <View style={styles.statCard}>
          <Icon name="event" size={24} color="#2196F3" />
          <Text style={styles.statValue}>{userData.recentReports.length}</Text>
          <Text style={styles.statLabel}>Reports</Text>
        </View>
      </View>
      
      <Card title="Daily Horoscope" style={styles.horoscopeCard}>
        <View style={styles.horoscopeHeader}>
          <Text style={styles.horoscopeSign}>{userData.dailyHoroscope.sign}</Text>
          <Text style={styles.horoscopeDate}>{userData.dailyHoroscope.date}</Text>
        </View>
        
        <Text style={styles.horoscopeText}>{userData.dailyHoroscope.text}</Text>
        
        <View style={styles.horoscopeDetails}>
          <View style={styles.horoscopeDetail}>
            <Text style={styles.horoscopeDetailLabel}>Mood</Text>
            <Text style={styles.horoscopeDetailValue}>{userData.dailyHoroscope.mood}</Text>
          </View>
          
          <View style={styles.horoscopeDetail}>
            <Text style={styles.horoscopeDetailLabel}>Lucky Number</Text>
            <Text style={styles.horoscopeDetailValue}>{userData.dailyHoroscope.luckyNumber}</Text>
          </View>
          
          <View style={styles.horoscopeDetail}>
            <Text style={styles.horoscopeDetailLabel}>Compatibility</Text>
            <Text style={styles.horoscopeDetailValue}>{userData.dailyHoroscope.compatibility}</Text>
          </View>
        </View>
      </Card>
      
      <Card title="Birth Chart Summary" style={styles.birthChartCard}>
        <View style={styles.birthChartContent}>
          <View style={styles.birthChartItem}>
            <Text style={styles.birthChartLabel}>Sun Sign</Text>
            <Text style={styles.birthChartValue}>{userData.birthChart.sun}</Text>
          </View>
          
          <View style={styles.birthChartItem}>
            <Text style={styles.birthChartLabel}>Moon Sign</Text>
            <Text style={styles.birthChartValue}>{userData.birthChart.moon}</Text>
          </View>
          
          <View style={styles.birthChartItem}>
            <Text style={styles.birthChartLabel}>Ascendant</Text>
            <Text style={styles.birthChartValue}>{userData.birthChart.ascendant}</Text>
          </View>
        </View>
        
        <Text style={styles.lastViewedText}>
          Last viewed: {userData.birthChart.lastViewed}
        </Text>
        
        <Button 
          title="View Full Chart" 
          onPress={() => {}} 
          size="small"
          style={styles.viewChartButton}
        />
      </Card>
      
      <Card title="Transit Alerts" style={styles.transitCard}>
        {userData.transitAlerts.map((transit, index) => (
          <View key={index} style={[styles.transitItem, index < userData.transitAlerts.length - 1 && styles.transitItemBorder]}>
            <View style={styles.transitHeader}>
              <Text style={styles.transitTitle}>
                {transit.planet} {transit.event}
              </Text>
              <Text style={styles.transitDate}>
                {transit.startDate}{transit.endDate ? ` to ${transit.endDate}` : ''}
              </Text>
            </View>
            <Text style={styles.transitImpact}>{transit.impact}</Text>
          </View>
        ))}
      </Card>
      
      <Card title="Recent Reports" style={styles.reportsCard}>
        {userData.recentReports.length > 0 ? (
          userData.recentReports.map((report, index) => (
            <TouchableOpacity 
              key={report.id} 
              style={[styles.reportItem, index < userData.recentReports.length - 1 && styles.reportItemBorder]}
              onPress={() => {}}
            >
              <Icon name="description" size={20} color="#757575" />
              <Text style={styles.reportTitle}>{report.title}</Text>
              <Text style={styles.reportDate}>{report.date}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noReportsText}>You haven't purchased any reports yet</Text>
        )}
        
        <Button 
          title="View All Reports" 
          onPress={() => {}} 
          variant="outline"
          size="small"
          style={styles.viewAllButton}
        />
      </Card>
      
      <View style={styles.subscriptionContainer}>
        <Text style={styles.subscriptionTitle}>
          {userData.subscription} Subscription
        </Text>
        <Text style={styles.subscriptionDate}>
          Valid until: {userData.subscriptionEndDate}
        </Text>
        <Button 
          title="Manage Subscription" 
          onPress={() => {}} 
          variant="outline"
          style={styles.manageButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#f4511e',
  },
  userInfoContainer: {
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  dateText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    width: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  horoscopeCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  horoscopeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  horoscopeSign: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  horoscopeDate: {
    fontSize: 14,
    color: '#757575',
  },
  horoscopeText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 16,
  },
  horoscopeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  horoscopeDetail: {
    alignItems: 'center',
  },
  horoscopeDetailLabel: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
  },
  horoscopeDetailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  birthChartCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  birthChartContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  birthChartItem: {
    alignItems: 'center',
  },
  birthChartLabel: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
  },
  birthChartValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  lastViewedText: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 12,
  },
  viewChartButton: {
    alignSelf: 'flex-start',
  },
  transitCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  transitItem: {
    marginBottom: 12,
    paddingBottom: 12,
  },
  transitItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  transitTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  transitDate: {
    fontSize: 12,
    color: '#757575',
  },
  transitImpact: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  reportsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  reportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  reportItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  reportTitle: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
  },
  reportDate: {
    fontSize: 12,
    color: '#757575',
  },
  noReportsText: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    marginVertical: 16,
  },
  viewAllButton: {
    marginTop: 8,
    alignSelf: 'center',
  },
  subscriptionContainer: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 32,
  },
  subscriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  subscriptionDate: {
    fontSize: 14,
    color: '#757575',
    marginVertical: 8,
  },
  manageButton: {
    marginTop: 8,
  },
});

export default DashboardScreen;

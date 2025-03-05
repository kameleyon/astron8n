import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image
} from 'react-native';
import { Card, Input, Button, Loading } from '../components/ui';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { supabase } from '../supabase';

const BirthChartScreen = () => {
  const [activeTab, setActiveTab] = useState('form'); // 'form' or 'result'
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthLocation, setBirthLocation] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Result state (mock data for now)
  const [chartData, setChartData] = useState<any>(null);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!birthDate.trim()) {
      newErrors.birthDate = 'Birth date is required';
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
      newErrors.birthDate = 'Invalid date format. Use YYYY-MM-DD';
    }
    
    if (birthTime && !/^([01]\d|2[0-3]):([0-5]\d)$/.test(birthTime)) {
      newErrors.birthTime = 'Invalid time format. Use HH:MM (24-hour)';
    }
    
    if (!birthLocation.trim()) {
      newErrors.birthLocation = 'Birth location is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleCalculate = async () => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real app, this would call your API
      // For now, we'll just simulate a delay and set mock data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setChartData({
        sun: { sign: 'Leo', house: 5, degree: 15 },
        moon: { sign: 'Cancer', house: 4, degree: 22 },
        ascendant: { sign: 'Aries', degree: 10 },
        planets: [
          { name: 'Mercury', sign: 'Leo', house: 5, degree: 8 },
          { name: 'Venus', sign: 'Virgo', house: 6, degree: 3 },
          { name: 'Mars', sign: 'Gemini', house: 3, degree: 27 },
          { name: 'Jupiter', sign: 'Taurus', house: 2, degree: 12 },
          { name: 'Saturn', sign: 'Aquarius', house: 11, degree: 5 },
        ],
        aspects: [
          { planet1: 'Sun', planet2: 'Moon', type: 'Trine', orb: 2.3 },
          { planet1: 'Sun', planet2: 'Mercury', type: 'Conjunction', orb: 7 },
          { planet1: 'Moon', planet2: 'Venus', type: 'Square', orb: 1.5 },
        ]
      });
      
      setActiveTab('result');
    } catch (error) {
      console.error('Error calculating birth chart:', error);
      // Handle error
    } finally {
      setLoading(false);
    }
  };
  
  const renderForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>Enter Your Birth Details</Text>
      <Text style={styles.formSubtitle}>
        Provide accurate information to get the most precise birth chart reading
      </Text>
      
      <Input
        label="Full Name"
        placeholder="Enter your full name"
        value={name}
        onChangeText={setName}
        error={errors.name}
        leftIcon="person"
      />
      
      <Input
        label="Birth Date"
        placeholder="YYYY-MM-DD"
        value={birthDate}
        onChangeText={setBirthDate}
        error={errors.birthDate}
        leftIcon="calendar-today"
        keyboardType="numbers-and-punctuation"
      />
      
      <Input
        label="Birth Time (optional but recommended)"
        placeholder="HH:MM (24-hour format)"
        value={birthTime}
        onChangeText={setBirthTime}
        error={errors.birthTime}
        leftIcon="access-time"
        keyboardType="numbers-and-punctuation"
      />
      
      <Input
        label="Birth Location"
        placeholder="City, Country"
        value={birthLocation}
        onChangeText={setBirthLocation}
        error={errors.birthLocation}
        leftIcon="location-on"
      />
      
      <Button
        title="Calculate Birth Chart"
        onPress={handleCalculate}
        fullWidth
        style={styles.calculateButton}
      />
      
      <Text style={styles.privacyNote}>
        Your data is stored securely and used only for astrological calculations.
      </Text>
    </View>
  );
  
  const renderResult = () => (
    <View style={styles.resultContainer}>
      <View style={styles.chartImageContainer}>
        <Image
          source={{ uri: 'https://via.placeholder.com/350x350' }}
          style={styles.chartImage}
        />
      </View>
      
      <Card title="Sun Sign" style={styles.planetCard}>
        <View style={styles.planetInfo}>
          <Text style={styles.planetSign}>{chartData.sun.sign}</Text>
          <Text style={styles.planetDetails}>
            House {chartData.sun.house} • {chartData.sun.degree}°
          </Text>
          <Text style={styles.planetDescription}>
            Your Sun sign represents your core identity and life purpose. In Leo, you are creative, generous, and have a natural flair for leadership.
          </Text>
        </View>
      </Card>
      
      <Card title="Moon Sign" style={styles.planetCard}>
        <View style={styles.planetInfo}>
          <Text style={styles.planetSign}>{chartData.moon.sign}</Text>
          <Text style={styles.planetDetails}>
            House {chartData.moon.house} • {chartData.moon.degree}°
          </Text>
          <Text style={styles.planetDescription}>
            Your Moon sign represents your emotional nature. In Cancer, you are nurturing, sensitive, and deeply connected to your home and family.
          </Text>
        </View>
      </Card>
      
      <Card title="Ascendant (Rising Sign)" style={styles.planetCard}>
        <View style={styles.planetInfo}>
          <Text style={styles.planetSign}>{chartData.ascendant.sign}</Text>
          <Text style={styles.planetDetails}>
            {chartData.ascendant.degree}°
          </Text>
          <Text style={styles.planetDescription}>
            Your Ascendant represents how others see you and your approach to the world. With Aries rising, you appear confident, direct, and action-oriented.
          </Text>
        </View>
      </Card>
      
      <Button
        title="View Full Chart Details"
        onPress={() => {}}
        style={styles.viewFullButton}
      />
      
      <Button
        title="Calculate Another Chart"
        onPress={() => setActiveTab('form')}
        variant="outline"
        style={styles.calculateAnotherButton}
      />
    </View>
  );
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'form' && styles.activeTab]}
          onPress={() => setActiveTab('form')}
        >
          <Text style={[styles.tabText, activeTab === 'form' && styles.activeTabText]}>
            Birth Details
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'result' && styles.activeTab]}
          onPress={() => chartData && setActiveTab('result')}
          disabled={!chartData}
        >
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'result' && styles.activeTabText,
              !chartData && styles.disabledTabText
            ]}
          >
            Chart Results
          </Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'form' ? renderForm() : renderResult()}
      
      <Loading loading={loading} overlay message="Calculating your birth chart..." />
    </ScrollView>
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
  disabledTabText: {
    color: '#bdbdbd',
  },
  formContainer: {
    padding: 16,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  formSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  calculateButton: {
    marginTop: 16,
  },
  privacyNote: {
    fontSize: 12,
    color: '#757575',
    textAlign: 'center',
    marginTop: 16,
  },
  resultContainer: {
    padding: 16,
  },
  chartImageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  chartImage: {
    width: 280,
    height: 280,
    borderRadius: 140,
  },
  planetCard: {
    marginBottom: 16,
  },
  planetInfo: {
    alignItems: 'center',
  },
  planetSign: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  planetDetails: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 12,
  },
  planetDescription: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    textAlign: 'center',
  },
  viewFullButton: {
    marginTop: 8,
  },
  calculateAnotherButton: {
    marginTop: 16,
  },
});

export default BirthChartScreen;

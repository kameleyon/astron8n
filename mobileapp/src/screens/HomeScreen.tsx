import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity 
} from 'react-native';
import { Card, Button } from '../components/ui';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HomeScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome to AstroGenie</Text>
        <Text style={styles.subtitleText}>Your personal astrology assistant</Text>
      </View>
      
      <View style={styles.featuredSection}>
        <Text style={styles.sectionTitle}>Featured</Text>
        <Card 
          style={styles.featuredCard}
          onPress={() => {}}
        >
          <Image 
            source={{ uri: 'https://via.placeholder.com/600x300' }} 
            style={styles.featuredImage} 
          />
          <View style={styles.featuredContent}>
            <Text style={styles.featuredTitle}>Discover Your Birth Chart</Text>
            <Text style={styles.featuredDescription}>
              Explore your astrological profile and understand your personality traits, strengths, and challenges.
            </Text>
            <Button 
              title="Get Started" 
              onPress={() => {}} 
              size="small"
              style={styles.featuredButton}
            />
          </View>
        </Card>
      </View>
      
      <View style={styles.quickActionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity style={styles.quickActionItem} onPress={() => {}}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#FFC107' }]}>
              <Icon name="person" size={24} color="#fff" />
            </View>
            <Text style={styles.quickActionText}>Birth Chart</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionItem} onPress={() => {}}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#4CAF50' }]}>
              <Icon name="chat" size={24} color="#fff" />
            </View>
            <Text style={styles.quickActionText}>Astro Chat</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionItem} onPress={() => {}}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#2196F3' }]}>
              <Icon name="description" size={24} color="#fff" />
            </View>
            <Text style={styles.quickActionText}>Reports</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionItem} onPress={() => {}}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#9C27B0' }]}>
              <Icon name="favorite" size={24} color="#fff" />
            </View>
            <Text style={styles.quickActionText}>Compatibility</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.recentSection}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <Card style={styles.recentCard}>
          <View style={styles.recentItem}>
            <Icon name="history" size={20} color="#757575" />
            <Text style={styles.recentText}>You viewed your birth chart</Text>
            <Text style={styles.recentTime}>2h ago</Text>
          </View>
        </Card>
        
        <Card style={styles.recentCard}>
          <View style={styles.recentItem}>
            <Icon name="chat" size={20} color="#757575" />
            <Text style={styles.recentText}>Chat with AstroGenie AI</Text>
            <Text style={styles.recentTime}>Yesterday</Text>
          </View>
        </Card>
      </View>
      
      <View style={styles.tipsSection}>
        <Text style={styles.sectionTitle}>Astrology Tip</Text>
        <Card style={styles.tipCard}>
          <Text style={styles.tipTitle}>Did you know?</Text>
          <Text style={styles.tipText}>
            Your Moon sign represents your emotional nature and how you instinctively react to situations. It's just as important as your Sun sign!
          </Text>
        </Card>
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
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitleText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  featuredSection: {
    padding: 16,
  },
  featuredCard: {
    padding: 0,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  featuredContent: {
    padding: 16,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  featuredDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  featuredButton: {
    alignSelf: 'flex-start',
  },
  quickActionsSection: {
    padding: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  recentSection: {
    padding: 16,
  },
  recentCard: {
    marginBottom: 8,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#333',
  },
  recentTime: {
    fontSize: 12,
    color: '#757575',
  },
  tipsSection: {
    padding: 16,
    paddingBottom: 32,
  },
  tipCard: {
    backgroundColor: '#FFF9C4',
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  tipText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
});

export default HomeScreen;

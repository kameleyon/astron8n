import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import Colors from '../constants/Colors';

const reports = [
  {
    id: '30-days',
    title: 'Next 30-Days Focus & Action Plan Report',
    description: 'The 30-Day Focus & Action Plan is a personalized roadmap designed to help you navigate key areas of life—career, relationships, finances, personal growth, and well-being—over the next month. Using insights from astrology, I Ching, human design, numerology, life path, and cardology, this report provides a clear and actionable guide tailored to your unique energy. You\'ll receive key transits, focused action steps, power dates, and strategic insights to align with opportunities and overcome challenges. Whether you\'re seeking clarity, transformation, or success, this report equips you with the tools to make the most of the next 30 days.',
    price: 14.99,
    available: true
  },
  {
    id: 'Birth-Chart-Analysis',
    title: 'Birth Chart Analysis',
    description: 'Unlock the secrets of your cosmic blueprint with our comprehensive Birth Chart Analysis. This in-depth report examines your unique astrological makeup at the moment of your birth, revealing your core personality traits, inherent talents, life challenges, and destined path. We analyze the positions of all planets, houses, and aspects to provide profound insights into your life purpose, relationships, career inclinations, and personal growth opportunities. Perfect for those seeking deep self-understanding and guidance for life\'s major decisions.',
    price: 29.99,
    available: false
  },
  {
    id: 'relationship',
    title: 'Relationship Compatibility Report',
    description: 'Discover the true potential of your relationships with our detailed Compatibility Analysis. This report goes beyond surface-level matching to examine the deep astrological synergy between two individuals. We analyze the interaction between both birth charts to reveal areas of harmony, growth opportunities, potential challenges, and karmic connections. Understand communication patterns, emotional bonds, shared values, and long-term compatibility. Essential for couples, business partners, or anyone seeking to improve significant relationships in their life.',
    price: 24.99,
    available: false
  },
  {
    id: 'career',
    title: 'The Career that fits you best',
    description: 'Find your true professional calling with our Career Path Analysis. This comprehensive report examines your birth chart\'s career indicators to reveal your natural talents, ideal work environment, leadership style, and potential paths to success. We analyze your 10th house of career, 2nd house of income, and key planetary aspects to identify periods of professional growth and opportunity. Includes insights about work relationships, money management patterns, and timing for career moves. Perfect for career changes, business decisions, or long-term professional planning.',
    price: 19.99,
    available: false
  },
  {
    id: 'Partnership',
    title: 'Who is my soulmate',
    description: 'Uncover the qualities of your ideal life partner with our Soulmate Connection Report. This unique analysis examines your birth chart\'s relationship indicators to reveal the characteristics of your most compatible partner. We analyze your 7th house of partnerships, Venus and Mars positions, and significant aspects to describe your ideal match\'s personality, values, and life approach. Learn about timing for meaningful connections, relationship patterns to embrace or avoid, and how to recognize your true soulmate when they appear in your life.',
    price: 14.99,
    available: false
  },
  {
    id: 'health',
    title: 'Health & Well-Being Report',
    description: 'Transform your approach to health with our Wellness Alignment Report. This holistic analysis examines your birth chart\'s health and vitality indicators to create a personalized wellness strategy. We analyze your 1st house of physical body, 6th house of health routines, and key planetary aspects to understand your energy patterns, stress responses, and natural healing abilities. Receive insights about diet preferences, exercise recommendations, stress management techniques, and optimal rest cycles. Includes timing for health initiatives and preventive measures. Essential for anyone seeking to enhance their physical and emotional well-being through cosmic wisdom.',
    price: 14.99,
    available: false
  }
];

const ReportsScreen: React.FC = () => (
  <View style={styles.root}>
    <Header />
    <ScrollView contentContainerStyle={styles.scroll}>
      <Text style={styles.pageTitle}>Available Reports</Text>

      {reports.map((report) => (
        <Card key={report.id} style={styles.card}>
          <CardHeader>
            {/* TODO: Add Icon */}
            <CardTitle style={styles.cardTitle}>{report.title}</CardTitle>
            <Text style={styles.price}>${report.price}</Text>
          </CardHeader>
          <CardContent>
            <CardDescription style={styles.cardDescription}>{report.description}</CardDescription>
            <Button
              style={styles.button}
              disabled={!report.available}
              onPress={() => { /* TODO: Implement payment/generation logic */ }}
            >
              {report.available ? 'Generate Report' : 'Coming Soon'}
            </Button>
          </CardContent>
        </Card>
      ))}
    </ScrollView>
    <Footer />
  </View>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background
  },
  scroll: {
    padding: 20,
    paddingBottom: 40
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 24
  },
  card: {
    marginBottom: 16
  },
  cardTitle: {
    color: Colors.primary,
    fontSize: 18,
    marginBottom: 4
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8
  },
  cardDescription: {
    color: Colors.mutedForeground,
    fontSize: 14,
    marginBottom: 16
  },
  button: {
    marginTop: 'auto' // Push button to bottom of card content
  }
});

export default ReportsScreen;
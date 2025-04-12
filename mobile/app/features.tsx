import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import Colors from '../constants/Colors';

const features = [
  {
    title: "Birth Chart Analysis",
    description: "Get detailed insights into your natal chart with AI-powered interpretations",
    items: [
      "Interactive birth chart wheel",
      "Detailed planetary positions",
      "House system interpretations",
      "Dynamic aspect analysis",
      "Pattern detection",
      "Special features identification"
    ]
  },
  {
    title: "AI Chat Assistant",
    description: "Chat with our AI to get personalized astrological guidance anytime",
    items: [
      "Natural language understanding",
      "Context-aware responses",
      "Birth chart integration",
      "Multi-model AI system",
      "Chat history tracking",
      "Real-time transit integration"
    ]
  },
  {
    title: "Custom Reports",
    description: "Generate in-depth reports for specific life areas or time periods",
    items: [
      "30-day personalized forecasts",
      "Transit analysis",
      "Aspect interpretations",
      "PDF generation",
      "Secure storage",
      "Report history"
    ]
  },
  {
    title: "Transit Predictions",
    description: "Understand how current planetary positions affect your chart",
    items: [
      "Real-time planetary tracking",
      "Aspect calculations",
      "House position monitoring",
      "Retrograde periods",
      "Eclipse predictions",
      "Daily transit updates"
    ]
  },
  {
    title: "Compatibility Analysis",
    description: "Compare charts and understand relationship dynamics",
    items: [
      "Synastry analysis",
      "Composite chart creation",
      "Relationship patterns",
      "Compatibility scores",
      "Aspect interpretations",
      "Dynamic compatibility updates"
    ]
  },
  {
    title: "Flexible Credits",
    description: "Use credits for readings, reports, and extended chat sessions",
    items: [
      "Multiple token packages",
      "Real-time balance tracking",
      "Usage monitoring",
      "Transaction history",
      "Credit alerts",
      "Activity logs"
    ]
  },
  {
    title: "Developer API",
    description: "Integrate agai's powerful birth chart calculations into your own applications",
    items: [
      "RESTful API access",
      "Comprehensive documentation",
      "Multiple subscription tiers",
      "Usage analytics",
      "Secure authentication",
      "Developer support"
    ]
  }
];

const pricing = {
  monthly: {
    title: "Monthly Plan",
    price: "$7.99",
    period: "per month",
    description: "Perfect for regular insights",
    features: [
      "2,500 credits monthly",
      "Full birth chart analysis",
      "Unlimited chat sessions",
      "Custom reports",
      "API access",
      "Priority support"
    ]
  },
  tokens: [
    {
      title: "Basic Package",
      price: "$2.99",
      tokens: "5,000",
      description: "Perfect for casual users"
    },
    {
      title: "Pro Package",
      price: "$3.99",
      tokens: "9,000",
      description: "Best value for regular users",
      popular: true
    },
    {
      title: "Premium Package",
      price: "$5.99",
      tokens: "17,000",
      description: "Ideal for power users"
    }
  ]
};

const FeaturesScreen: React.FC = () => (
  <View style={styles.root}>
    <Header />
    <ScrollView contentContainerStyle={styles.scroll}>
      <Text style={styles.pageTitle}>Features</Text>
      <Text style={styles.pageSubtitle}>
        Discover the power of AI-driven astrological insights with our comprehensive feature set
      </Text>

      {/* Features Section */}
      <View style={styles.section}>
        {features.map((feature, index) => (
          <Card key={index} style={styles.card}>
            <CardHeader>
              {/* TODO: Add Icon */}
              <CardTitle style={styles.cardTitle}>{feature.title}</CardTitle>
              <CardDescription style={styles.cardDescription}>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {feature.items.map((item, i) => (
                <View key={i} style={styles.listItem}>
                  {/* TODO: Add Check Icon */}
                  <Text style={styles.listItemText}>{item}</Text>
                </View>
              ))}
            </CardContent>
          </Card>
        ))}
      </View>

      {/* Pricing Section */}
      <Text style={styles.pageTitle}>Simple, Transparent Pricing</Text>
      <Text style={styles.pageSubtitle}>
        Choose the plan that works best for you
      </Text>
      <View style={styles.section}>
        {/* Monthly Plan */}
        <Card style={[styles.card, styles.pricingCard, styles.monthlyCard]}>
          <CardHeader>
            <View style={styles.priceHeader}>
              <View>
                <CardTitle style={styles.cardTitle}>{pricing.monthly.title}</CardTitle>
                <CardDescription style={styles.cardDescription}>{pricing.monthly.description}</CardDescription>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>{pricing.monthly.price}</Text>
                <Text style={styles.pricePeriod}>{pricing.monthly.period}</Text>
              </View>
            </View>
          </CardHeader>
          <CardContent>
            {pricing.monthly.features.map((item, i) => (
              <View key={i} style={styles.listItem}>
                {/* TODO: Add Check Icon */}
                <Text style={styles.listItemText}>{item}</Text>
              </View>
            ))}
          </CardContent>
        </Card>

        {/* Token Packages */}
        {pricing.tokens.map((pkg, index) => (
          <Card key={index} style={[styles.card, styles.pricingCard, pkg.popular && styles.popularCard]}>
            {pkg.popular && <Text style={styles.popularBadge}>Most Popular</Text>}
            <CardHeader>
              <View style={styles.priceHeader}>
                <View>
                  <CardTitle style={styles.cardTitle}>{pkg.title}</CardTitle>
                  <CardDescription style={styles.cardDescription}>{pkg.description}</CardDescription>
                </View>
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>{pkg.price}</Text>
                  <Text style={styles.pricePeriod}>{pkg.tokens} tokens</Text>
                </View>
              </View>
            </CardHeader>
          </Card>
        ))}
      </View>
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
    marginBottom: 8
  },
  pageSubtitle: {
    fontSize: 16,
    color: Colors.mutedForeground,
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: '80%'
  },
  section: {
    marginBottom: 32,
    width: '100%'
  },
  card: {
    marginBottom: 16
  },
  cardTitle: {
    color: Colors.primary,
    fontSize: 18
  },
  cardDescription: {
    color: Colors.mutedForeground,
    fontSize: 14
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  listItemText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 8 // Add margin if using icons
  },
  pricingCard: {
    // Specific styles for pricing cards if needed
  },
  monthlyCard: {
    borderColor: Colors.primary,
    borderWidth: 2
  },
  popularCard: {
    borderColor: Colors.primary,
    borderWidth: 1,
    position: 'relative'
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 10,
    backgroundColor: Colors.primary,
    color: Colors.primaryForeground,
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden'
  },
  priceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  priceContainer: {
    alignItems: 'flex-end'
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary
  },
  pricePeriod: {
    fontSize: 12,
    color: Colors.mutedForeground
  }
});

export default FeaturesScreen;
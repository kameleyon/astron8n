import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Colors from '../../constants/Colors';

const sampleProfile = {
  name: 'Jane Doe',
  email: 'jane.doe@email.com',
  birthDate: '1990-05-15',
  birthLocation: 'New York, NY',
};

const sampleReports = [
  { id: 1, title: '30-Day Focus & Action Plan', date: '2025-04-01', status: 'Ready' },
  { id: 2, title: 'Birth Chart Analysis', date: '2025-03-15', status: 'Ready' },
];

const ProfileScreen: React.FC = () => (
  <View style={styles.root}>
    <Header />
    <View style={styles.content}>
      <Card style={styles.profileCard}>
        <CardHeader>
          <CardTitle style={styles.profileTitle}>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{sampleProfile.name}</Text>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{sampleProfile.email}</Text>
          <Text style={styles.label}>Birth Date:</Text>
          <Text style={styles.value}>{sampleProfile.birthDate}</Text>
          <Text style={styles.label}>Birth Location:</Text>
          <Text style={styles.value}>{sampleProfile.birthLocation}</Text>
        </CardContent>
      </Card>
      <Text style={styles.sectionTitle}>Reports</Text>
      {sampleReports.map((report) => (
        <Card key={report.id} style={styles.reportCard}>
          <CardHeader>
            <CardTitle style={styles.reportTitle}>{report.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <Text style={styles.reportDetail}>Date: {report.date}</Text>
            <Text style={styles.reportDetail}>Status: {report.status}</Text>
          </CardContent>
        </Card>
      ))}
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
    padding: 20,
    alignItems: 'center'
  },
  profileCard: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 24
  },
  profileTitle: {
    color: Colors.primary,
    fontSize: 20,
    marginBottom: 8
  },
  label: {
    fontSize: 14,
    color: Colors.mutedForeground,
    marginTop: 8
  },
  value: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: 'bold'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 12,
    marginTop: 8,
    alignSelf: 'flex-start'
  },
  reportCard: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 16
  },
  reportTitle: {
    color: Colors.primary,
    fontSize: 16
  },
  reportDetail: {
    fontSize: 14,
    color: Colors.text
  }
});

export default ProfileScreen;
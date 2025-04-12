import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, StatusBar } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import ChatInterfaceindex from '../components/ChatInterfaceindex';

export default function HomeScreen() {
  const [showAuth, setShowAuth] = useState(false);

  const handleAuth = () => {
    setShowAuth(true);
    // Implement auth modal or navigation here
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Header onAuth={handleAuth} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Hero onAuth={handleAuth} />
        <ChatInterfaceindex />
      </ScrollView>
      <Footer />
      {/* TODO: Implement AuthModal when ready */}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff'
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 32
  }
});
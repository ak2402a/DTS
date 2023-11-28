import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = () => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  async function clearStorage() {
    try {
      await AsyncStorage.clear();
      Alert.alert('Success', 'AsyncStorage has been cleared.');
    } catch (e) {
      Alert.alert('Error', 'Failed to clear AsyncStorage.');
    }
  }

  return (
    <View style={styles.container}>
      <Text>Current theme: {theme}</Text>
      <Button title="Toggle Theme" onPress={toggleTheme} />
      <Button title="Clear AsyncStorage" onPress={clearStorage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SettingsScreen;

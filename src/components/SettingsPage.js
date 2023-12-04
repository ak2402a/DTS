import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import db from './FirebaseConfig/databaseSetup'; 
import { ref, remove, set } from "firebase/database";

const SettingsScreen = () => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  async function clearFirebaseData() {
    try {
      const tasksRef = ref(db, 'tasks');
      await remove(tasksRef);
      Alert.alert('Success', 'Firebase data has been cleared.');
    } catch (e) {
      Alert.alert('Error', 'Failed to clear Firebase data.');
      console.error("Error removing data: ", e);
    }
  }

  async function clearSurveyData() {
    try {
      // Set the last survey date to a past date, so the survey will show up next time
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const formattedDate = yesterday.toISOString().split('T')[0];

      await set(ref(db, 'lastSurveyDate/'), formattedDate);
      Alert.alert('Success', 'Survey data has been cleared.');
    } catch (e) {
      Alert.alert('Error', 'Failed to clear survey data.');
      console.error("Error updating survey data: ", e);
    }
  }

  return (
    <View style={styles.container}>
      <Text>Current theme: {theme}</Text>
      <Button title="Toggle Theme" onPress={toggleTheme} />
      <Button title="Clear Firebase Data" onPress={clearFirebaseData} />
      <Button title="Clear Survey Data" onPress={clearSurveyData} />
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

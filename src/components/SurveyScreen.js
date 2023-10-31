import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';

const SurveyScreen = () => {
  const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(() => {
    // Fetch previously saved data from AsyncStorage on component mount
    const fetchData = async () => {
      const savedData = await AsyncStorage.getItem('surveySelection');
      if (savedData) {
        setSelectedOptions(JSON.parse(savedData));
      }
    };
    fetchData();
  }, []);

  const toggleOption = (option) => {
    setSelectedOptions(prevState => ({
      ...prevState,
      [option]: !prevState[option]
    }));
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('surveySelection', JSON.stringify(selectedOptions));
      console.log('Data saved');
    } catch (e) {
      console.error('Failed to save survey data', e);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Survey</Text>
      
      {['Option 1', 'Option 2', 'Option 3'].map(option => (
        <View key={option} style={styles.checkboxContainer}>
          <CheckBox
            value={selectedOptions[option]}
            onValueChange={() => toggleOption(option)}
          />
          <Text>{option}</Text>
        </View>
      ))}

      <Button title="Save" onPress={saveData} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
});

export default SurveyScreen;

import React, { useState } from 'react';
import { Modal, View, Text, CheckBox, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function SurveyModal({ isVisible, onClose }) {
  // State variables for checkboxes
  const [isChecked1, setIsChecked1] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);

  const saveSurveyData = async () => {
    // Save survey data to AsyncStorage
    const surveyData = {
      question1: isChecked1,
      question2: isChecked2,
    };
    await AsyncStorage.setItem('surveyData', JSON.stringify(surveyData));
    // Close the modal
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Survey Feature</Text>
          <CheckBox value={isChecked1} onValueChange={setIsChecked1} />
          <Text>Question 1</Text>
          <CheckBox value={isChecked2} onValueChange={setIsChecked2} />
          <Text>Question 2</Text>
          {/* Add more questions as needed */}
          <Button title="Submit" onPress={saveSurveyData} />
        </View>
      </View>
    </Modal>
  );
}

export default SurveyModal;

import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function SurveyModal({ isVisible, onClose }) {
  // State variables for survey responses and current step
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({
    question1: null,
    question2: null,
    question3: null,
    question4: null,
  });
  const totalSteps = 4; // The total number of steps/questions in the survey

  const handleSelectOption = (questionKey, option) => {
    setSelectedOptions(prevState => ({ ...prevState, [questionKey]: option }));
  };

  const saveSurveyData = async () => {
    await AsyncStorage.setItem('surveyData', JSON.stringify(selectedOptions));
    onClose(); // Close the modal
  };

  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      saveSurveyData(); // Save data and close when on the last step
    }
  };

  // Custom Selector Button
  const SelectorButton = ({ questionKey, option, children }) => (
    <TouchableOpacity
      style={[
        styles.selector,
        selectedOptions[questionKey] === option && styles.selectedSelector,
      ]}
      onPress={() => handleSelectOption(questionKey, option)}
    >
      <Text style={[
        styles.selectorText,
        selectedOptions[questionKey] === option && styles.selectedText,
      ]}>
        {children}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Survey Feature</Text>

          {/* Render the question based on the current step */}
          {currentStep === 1 && (
            <>
              {/* Question 1 */}
              <Text style={styles.question}>Do you often prefer sorting tasks based on hard deadlines?</Text>
              <SelectorButton questionKey="question1" option="Yes">Yes</SelectorButton>
              <SelectorButton questionKey="question1" option="No">No</SelectorButton>
              <SelectorButton questionKey="question1" option="Sometimes">Sometimes</SelectorButton>
            </>
          )}
          {/* ... other questions for steps 2, 3, and 4 ... */}
          
          {/* Dynamic button text based on the step */}
          <TouchableOpacity style={styles.submitButton} onPress={goToNextStep}>
            <Text style={styles.submitButtonText}>{currentStep < totalSteps ? 'Next' : 'Submit'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // ... existing styles ...
  submitButton: {
    backgroundColor: '#1E90FF',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width: '100%',
  },
  submitButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dim background
  },
  modalView: {
    margin: 20,
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'flex-start',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  question: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 20,
  },
  selector: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
    backgroundColor: '#f8f8f8',
  },
  selectedSelector: {
    backgroundColor: '#1E90FF',
    borderColor: '#1E90FF',
  },
  selectorText: {
    textAlign: 'center',
    color: '#333',
  },
  selectedText: {
    color: 'white',
  },
  submitButton: {
    backgroundColor: '#1E90FF',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width: '100%',
  },
  submitButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  // ... add other styles as needed ...
});

export default SurveyModal;

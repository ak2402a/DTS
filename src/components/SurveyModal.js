import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ref, set } from "firebase/database";
import db from './FirebaseConfig/databaseSetup';

function SurveyModal({ isVisible, onClose }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({
    question1: null,
    question2: null,
    question3: null,
    question4: null,
  });
  const totalSteps = 4;

  const handleSelectOption = (questionKey, option) => {
    setSelectedOptions(prevState => ({ ...prevState, [questionKey]: option }));
  };

  const saveSurveyData = async () => {
    const surveyDataRef = ref(db, 'surveyData');

    set(surveyDataRef, selectedOptions)
      .then(() => {
        Alert.alert('Success', 'Survey data has been saved to Firebase.');
        onClose(); 
      })
      .catch((error) => {
        Alert.alert('Error', 'Failed to save survey data to Firebase.');
        console.error("Error writing survey data: ", error);
      });
  };

  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      saveSurveyData(); 
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
          {currentStep === 1 && (
            <>
              <Text style={styles.question}>Do you often have tasks with hard deadlines?</Text>
              <SelectorButton questionKey="question1" option="Yes">Yes</SelectorButton>
              <SelectorButton questionKey="question1" option="No">No</SelectorButton>
              <SelectorButton questionKey="question1" option="Sometimes">Sometimes</SelectorButton>
            </>
          )}

          {currentStep === 2 && (
            <>
              <Text style={styles.question}>How important is task efficiency to you?</Text>
              <SelectorButton questionKey="question2" option="Really Important">Really Important</SelectorButton>
              <SelectorButton questionKey="question2" option="Somewhat Important">Somewhat Important</SelectorButton>
              <SelectorButton questionKey="question2" option="Not Important At All">Not Important At All</SelectorButton>
            </>
          )}

          {currentStep === 3 && (
            <>
              <Text style={styles.question}>Do you like receiving task ideas?</Text>
              <SelectorButton questionKey="question3" option="Yes">Yes</SelectorButton>
              <SelectorButton questionKey="question3" option="No">No</SelectorButton>
              <SelectorButton questionKey="question3" option="Not Sure">Not Sure</SelectorButton>
            </>
          )}

          {currentStep === 4 && (
            <>
              <Text style={styles.question}>Do you prefer auto-rescheduling of tasks?</Text>
              <SelectorButton questionKey="question4" option="Yes">Yes</SelectorButton>
              <SelectorButton questionKey="question4" option="No">No</SelectorButton>
            </>
          )}

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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
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
});

export default SurveyModal;

// SettingsPage.js
import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';

const SETTINGS_SECTIONS = [
  { id: '1', title: 'My Account Info' },
  { id: '2', title: 'Preferences' },
  { id: '3', title: 'Privacy Policy' },
  { id: '4', title: 'Terms & Conditions' },
];

const SettingsPage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>
      {SETTINGS_SECTIONS.map(section => (
        <TouchableOpacity key={section.id} style={styles.sectionItem}>
          <Text style={styles.sectionText}>{section.title}</Text>
        </TouchableOpacity>
      ))}
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionItem: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  sectionText: {
    fontSize: 18,
  },
});

export default SettingsPage;

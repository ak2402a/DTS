import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import SurveyModal from './SurveyModal';

const DATA = [
  { id: '1', title: 'Task One' },
  { id: '2', title: 'Task Two' },
  { id: '3', title: 'Task Three' },
  { id: '4', title: 'Task Four' },
  { id: '5', title: 'Task Five' },
];

function HomePage() {
  const navigation = useNavigation();
  const [isSurveyVisible, setSurveyVisible] = useState(false);

  useEffect(() => {
    async function checkLastSurveyDate() {
      const lastSurveyDate = await AsyncStorage.getItem('lastSurveyDate');
      const today = new Date().toISOString().split('T')[0];
      
      if (lastSurveyDate !== today) {
        setSurveyVisible(true);
      }
    }
    
    checkLastSurveyDate();
  }, []);

  const closeSurvey = async () => {
    const today = new Date().toISOString().split('T')[0];
    await AsyncStorage.setItem('lastSurveyDate', today);
    setSurveyVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.header}>TODAY</Text>
        <View style={styles.progressBar}>
          <Text>Progress Level</Text>
        </View>
        <FlatList
          data={DATA}
          renderItem={({ item }) => <Text style={styles.taskItem}>{item.title}</Text>}
          keyExtractor={item => item.id}
        />
        <View style={styles.footer}>
          <Text>Home</Text>
          <Text>Menu</Text>
          <Text>Settings</Text>
        </View>
        <Button title="Go to Scheduling" onPress={() => navigation.navigate('Scheduling')} />
      </View>
      <SurveyModal isVisible={isSurveyVisible} onClose={closeSurvey} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  progressBar: {
    height: 20,
    width: '100%',
    backgroundColor: 'lightgray',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskItem: {
    fontSize: 18,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default HomePage;
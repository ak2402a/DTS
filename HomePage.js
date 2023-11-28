import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import SurveyModal from './SurveyModal';

function HomePage() {
  const navigation = useNavigation();
  const [isSurveyVisible, setSurveyVisible] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function checkLastSurveyDate() {
      const lastSurveyDate = await AsyncStorage.getItem('lastSurveyDate');
      const today = new Date().toISOString().split('T')[0];
      
      if (lastSurveyDate !== today) {
        setSurveyVisible(true);
      }
    }

    // Function to load tasks from AsyncStorage
    const loadTasks = async () => {
      const tasksData = await AsyncStorage.getItem('tasks');
      if (tasksData !== null) {
        setTasks(JSON.parse(tasksData));
      }
    };

    loadTasks();
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
          data={tasks.filter(task => task.date === new Date().toISOString().split('T')[0])} // Filter tasks for today's date
          renderItem={({ item }) => <Text style={styles.taskItem}>{item.title}</Text>}
          keyExtractor={item => item.id}
        />
        <View style={styles.footer}>
          <Button title="Home" onPress={() => navigation.navigate('Home')} />
          <Button title="Menu" onPress={() => navigation.navigate('Menu')} />
          <Button title="Settings" onPress={() => navigation.navigate('Settings')} />
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
    justifyContent: 'space-around',
    marginTop: 20,
  },
});

export default HomePage;

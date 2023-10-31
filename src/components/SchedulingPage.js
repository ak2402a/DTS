import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AddTaskModal from './AddTaskModal'; 

const SchedulingPage = ({ navigation }) => {
  const [events, setEvents] = useState([
    { id: '1', time: '08:00', title: 'Homework/Museum', date: '2023-10-17' },
    // ... (existing items)
  ]);
  const [isAddTaskModalVisible, setAddTaskModalVisible] = useState(false);
  const [currentDate, setCurrentDate] = useState('2023-10-17');

  const addTask = (newTask) => {
    setEvents([...events, { id: String(events.length + 1), ...newTask }]);
  };

  // Sort events by date and time
  const sortedEvents = [...events].sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput 
          style={styles.headerText} 
          value={currentDate} 
          onChangeText={setCurrentDate} 
        />
        <TouchableOpacity onPress={() => setAddTaskModalVisible(true)}>
          <Ionicons name="add" size={30} color="black" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={sortedEvents.filter(event => event.date === currentDate)}  // Filter by the selected date
        renderItem={({ item }) => (
          <View style={styles.eventItem}>
            <Text style={styles.time}>{item.time}</Text>
            <Text style={styles.title}>{item.title}</Text>
          </View>
        )}
        keyExtractor={item => item.id}
      />
      <Button title="Go to Settings" onPress={() => navigation.navigate('Settings')} />
      <AddTaskModal 
        isVisible={isAddTaskModalVisible} 
        onClose={() => setAddTaskModalVisible(false)} 
        addTask={addTask}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  eventItem: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  time: {
    fontSize: 18,
    width: 50,
  },
  title: {
    fontSize: 18,
  },
});

export default SchedulingPage;


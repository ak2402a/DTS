import React, { useState, useContext } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, Button, Picker } from 'react-native';
import { Calendar } from 'react-native-calendars';
import db from './FirebaseConfig/databaseSetup';
import { ref, push, set } from "firebase/database";
import TasksContext from './TasksContext';

const AddTaskModal = ({ isVisible, onClose }) => {
  const { setTasks } = useContext(TasksContext);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState(''); 
  const [priorityLevel, setPriorityLevel] = useState(1); 
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const handleAddTask = () => {
    const newTask = { title, time, duration, priorityLevel, date: selectedDate };
    const newTaskRef = push(ref(db, 'tasks'));

    set(newTaskRef, newTask).then(() => {
      setTitle('');
      setTime('');
      setDuration('');
      setPriorityLevel(1);
      setSelectedDate(new Date().toISOString().split('T')[0]);
      onClose();
    }).catch(error => {
      console.error("Error writing document: ", error);
    });
  };

  return (
    <Modal visible={isVisible} onRequestClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.header}>Add New Task</Text>

        <Calendar
          current={selectedDate}
          onDayPress={(day) => {
            setSelectedDate(day.dateString);
          }}
          markedDates={{
            [selectedDate]: { selected: true, marked: true, selectedColor: 'blue' },
          }}
        />

        <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
        <input 
          style={styles.timeInput} 
          type="time" 
          value={time} 
          onChange={e => setTime(e.target.value)} 
        />
        <TextInput 
          style={styles.input} 
          placeholder="Duration (minutes)" 
          value={duration} 
          onChangeText={setDuration} 
          keyboardType="numeric"
        />
        <Text style={styles.label}>Priority Level</Text>
        <Picker
          selectedValue={priorityLevel}
          style={styles.input}
          onValueChange={(itemValue, itemIndex) =>
            setPriorityLevel(itemValue)
          }>
          <Picker.Item label="1" value={1} />
          <Picker.Item label="2" value={2} />
          <Picker.Item label="3" value={3} />
          <Picker.Item label="4" value={4} />
          <Picker.Item label="5" value={5} />
        </Picker>

        <Button title="Add Task" onPress={handleAddTask} />
        <Button title="Cancel" onPress={onClose} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: 200,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: 200,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
  },
  timeInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 8
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default AddTaskModal;

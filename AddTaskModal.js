import React, { useState } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars'; // Import the Calendar component

const AddTaskModal = ({ isVisible, onClose, addTask }) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const handleAddTask = () => {
    // Use the selectedDate from the calendar
    addTask({ title, time, date: selectedDate });
    setTitle('');
    setTime('');
    setSelectedDate('');
    onClose();
  };

  return (
    <Modal visible={isVisible} onRequestClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.header}>Add New Task</Text>

        {/* Calendar component to pick a date */}
        <Calendar
          current={new Date().toISOString().split('T')[0]}
          onDayPress={(day) => {
            setSelectedDate(day.dateString);
          }}
          // If you want to mark the selected date in the calendar
          markedDates={{
            [selectedDate]: { selected: true, marked: true, selectedColor: 'blue' },
          }}
        />

        <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
        <TextInput style={styles.input} placeholder="Time (e.g., 10:00)" value={time} onChangeText={setTime} />
        {/* Remove the date TextInput since we now use the calendar */}
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
});

export default AddTaskModal;

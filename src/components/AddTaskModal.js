import React, { useState } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet } from 'react-native';

const AddTaskModal = ({ isVisible, onClose, addTask }) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  const handleAddTask = () => {
    addTask({ title, time, date });
    setTitle('');
    setTime('');
    setDate('');
    onClose();
  };

  return (
    <Modal visible={isVisible} onRequestClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.header}>Add New Task</Text>
        <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
        <TextInput style={styles.input} placeholder="Time" value={time} onChangeText={setTime} />
        <TextInput style={styles.input} placeholder="Date" value={date} onChangeText={setDate} />
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

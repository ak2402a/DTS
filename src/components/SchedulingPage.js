import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity, Modal } from 'react-native';
import { Calendar } from 'react-native-calendars';
import TasksContext from './TasksContext'; 
import AddTaskModal from './AddTaskModal'; 

const SchedulingPage = ({ navigation }) => {
  const { tasks, addTask } = useContext(TasksContext);
  const [isAddTaskModalVisible, setAddTaskModalVisible] = useState(false);
  const [isCalendarModalVisible, setCalendarModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const markedDates = {
    [selectedDate]: { selected: true, marked: true, selectedColor: 'blue' },
  };

  const onDateSelect = (day) => {
    setSelectedDate(day.dateString);
    setCalendarModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.datePickerButton} 
          onPress={() => setCalendarModalVisible(true)}
        >
          <Text style={styles.datePickerText}>{selectedDate}</Text>
        </TouchableOpacity>
        <Button title="Add Task" onPress={() => setAddTaskModalVisible(true)} />
      </View>

      <FlatList
        style={styles.taskList}
        data={tasks.filter(task => task.date === selectedDate)}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text style={styles.taskTitle}>{item.title}</Text>
          </View>
        )}
        keyExtractor={item => item.id}
      />

      <Modal
        visible={isCalendarModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setCalendarModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setCalendarModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Calendar
              style={styles.calendar}
              current={selectedDate}
              onDayPress={onDateSelect}
              markedDates={markedDates}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      <AddTaskModal 
        isVisible={isAddTaskModalVisible} 
        onClose={() => setAddTaskModalVisible(false)} 
        addTask={(newTask) => addTask({ ...newTask, date: selectedDate })}
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 15,
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: 'lightgray',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 10, 
    marginLeft: 15, 
    marginTop: 10, 
    width: 120, 
    alignSelf: 'flex-start', 
  },
  datePickerText: {
    fontSize: 16,
  },
  taskList: {
    flex: 1,
  },
  taskItem: {
    backgroundColor: 'white',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  taskTitle: {
    fontSize: 18,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dimmed background
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    width: '80%',
    maxWidth: 300, // You can adjust this as needed
  },
  calendar: {
    borderRadius: 10,
  },
});

export default SchedulingPage;

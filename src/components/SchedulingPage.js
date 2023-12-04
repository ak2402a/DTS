import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Calendar } from 'react-native-calendars';
import db from './FirebaseConfig/databaseSetup';
import { ref, onValue, push, set } from "firebase/database";
import AddTaskModal from './AddTaskModal';
import TimeSlot from './TimeSlot';

const SchedulingPage = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [isAddTaskModalVisible, setAddTaskModalVisible] = useState(false);
  const [isCalendarModalVisible, setCalendarModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const tasksRef = ref(db, 'tasks/');
    const unsubscribe = onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      const loadedTasks = data ? Object.keys(data).map(key => ({ ...data[key], id: key })) : [];
      setTasks(loadedTasks);
    });
    return () => unsubscribe();
  }, []);

  // Function to check if a task falls within a specific hour
  const isTaskInHour = (task, hour) => {
    const taskStartTime = new Date(`1970-01-01T${task.time}`);
    const taskEndTime = new Date(taskStartTime.getTime() + (task.duration * 60000));
    const hourStartTime = new Date(`1970-01-01T${hour}`);
    const nextHourStartTime = new Date(hourStartTime.getTime() + 3600000);

    return (taskStartTime >= hourStartTime && taskStartTime < nextHourStartTime) ||
           (taskEndTime > hourStartTime && taskEndTime <= nextHourStartTime) ||
           (taskStartTime <= hourStartTime && taskEndTime >= nextHourStartTime);
  };

  const sortedTasks = tasks.filter(task => task.date === selectedDate);

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

      <ScrollView style={styles.scheduleContainer}>
      {Array.from({ length: 24 }, (_, index) => {
        const hour = index < 10 ? `0${index}:00` : `${index}:00`;
        const hourTasks = sortedTasks.filter(task => isTaskInHour(task, hour));
        return (
          <TimeSlot 
            key={hour}
            time={hour}
            tasks={hourTasks}
          />
        );
      })}
      </ScrollView>

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
              markedDates={{
                [selectedDate]: { selected: true, marked: true, selectedColor: 'blue' }
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      <AddTaskModal
        isVisible={isAddTaskModalVisible} 
        onClose={() => setAddTaskModalVisible(false)} 
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
  scheduleContainer: {
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    margin: 20,
    alignSelf: 'center',
  },
  calendar: {
    borderRadius: 10,
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
});

export default SchedulingPage;
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TimeSlot = ({ time, tasks }) => {
  return (
    <View style={styles.timeSlot}>
      <Text style={styles.timeLabel}>{time}</Text>
      {tasks.map(task => {
        const endTime = new Date(new Date(`1970-01-01T${task.time}`).getTime() + task.duration * 60000);
        const endTimeStr = endTime.toTimeString().substring(0, 5); 

        return (
          <View key={task.id} style={styles.task}>
            <Text style={styles.taskText}>
              {task.title} - {task.time} to {endTimeStr}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  timeSlot: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  timeLabel: {
    fontWeight: 'bold',
  },
  task: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  taskText: {
    fontSize: 16,
  },
});

export default TimeSlot;

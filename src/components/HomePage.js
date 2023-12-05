import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SurveyModal from './SurveyModal';
import { ref, onValue, set, query, orderByChild, equalTo } from "firebase/database";
import db from './FirebaseConfig/databaseSetup';
import TasksContext from './TasksContext';
import { Modal } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { fetchSurveyData, fetchAllTasks, optimizeTasks, updateTasksInFirebase } from './optimizeTasks';


function HomePage() {
  const { tasks, setTasks } = useContext(TasksContext);
  const navigation = useNavigation();
  const [isSurveyVisible, setSurveyVisible] = useState(false);
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);


  const completionPercentage = tasks.length > 0
  ? (tasks.filter(task => task.completed).length / tasks.length) * 100
  : 0;

  const toggleTaskCompletion = (taskId, isCompleted) => {
    // Update the task's 'completed' status in Firebase
    const taskRef = ref(db, `tasks/${taskId}`);
    set(taskRef, { ...tasks.find(task => task.id === taskId), completed: !isCompleted })
      .then(() => {
        console.log('Task status updated successfully');
      })
      .catch(error => {
        console.error('Error updating task status:', error);
      });
  };

  const handleOptimizeTasks = async () => {
    try {
      const surveyData = await fetchSurveyData();
      const allTasks = await fetchAllTasks();
  
      // Proceed only if survey data and tasks are available
      if (surveyData && allTasks.length > 0) {
        const optimizedTasks = await optimizeTasks(selectedDate, allTasks, surveyData);
  
        // Check if optimizedTasks is an array and has elements
        if (Array.isArray(optimizedTasks) && optimizedTasks.length > 0) {
          await updateTasksInFirebase(optimizedTasks); // Update tasks in Firebase
          Alert.alert('Success', 'Tasks have been optimized successfully.');
        } else {
          Alert.alert('Error', 'No tasks were optimized.');
        }
      } else {
        Alert.alert('Error', 'No survey data or tasks available for optimization.');
      }
    } catch (error) {
      console.error('Optimization failed:', error);
      Alert.alert('Error', 'Optimization failed. Please try again later.');
    }
  };

  useEffect(() => {
    const tasksRef = ref(db, 'tasks/');
    const queryRef = query(tasksRef, orderByChild('date'), equalTo(selectedDate));
  
    const unsubscribeTasks = onValue(queryRef, (snapshot) => {
      const data = snapshot.val();
      const loadedTasks = data 
        ? Object.keys(data).map(key => ({ id: key, ...data[key] }))
          .sort((a, b) => a.time.localeCompare(b.time)) // Sort tasks by time
        : [];
      setTasks(loadedTasks);
    });

    // Check last survey date
    const lastSurveyDateRef = ref(db, 'lastSurveyDate/');
    const unsubscribeSurveyDate = onValue(lastSurveyDateRef, (snapshot) => {
      const lastSurveyDate = snapshot.val();
      const today = new Date().toISOString().split('T')[0];
      if (lastSurveyDate !== today) {
        setSurveyVisible(true);
      }
    });

    return () => {
      unsubscribeTasks();
      unsubscribeSurveyDate();
    };
  }, [selectedDate]);

  const closeSurvey = () => {
    const today = new Date().toISOString().split('T')[0];
    set(ref(db, 'lastSurveyDate/'), today);
    setSurveyVisible(false);
  };
  const onDateSelect = (day) => {
    setSelectedDate(day.dateString);
    setCalendarVisible(false);
  };


  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.header}>TODAY</Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${completionPercentage}%` }]} />
        </View>

        <View style={styles.buttonContainer}>
          <Button 
            title={`Select Date (${selectedDate})`} 
            onPress={() => setCalendarVisible(true)} 
          />
          <Button 
            title="Optimize Schedule" 
            onPress={handleOptimizeTasks} 
          />
        </View>
        <Modal
          visible={isCalendarVisible}
          transparent={true}
          onRequestClose={() => setCalendarVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPressOut={() => setCalendarVisible(false)}
          >
            <View style={styles.modalContent}>
              <Calendar
                onDayPress={onDateSelect}
                markedDates={{ [selectedDate]: { selected: true, marked: true } }}
              />
            </View>
          </TouchableOpacity>
        </Modal>
        
        <FlatList
          data={tasks}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => toggleTaskCompletion(item.id, item.completed)}>
              <Text style={[styles.taskItem, item.completed && styles.completedTask]}>{item.title}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id.toString()}
        />
      </View>
      <SurveyModal isVisible={isSurveyVisible} onClose={closeSurvey} />
    </View>
  );
}
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 10, // Add vertical margin for spacing
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  completedTask: {
    textDecorationLine: 'line-through', // Style for completed tasks
    color: 'grey',
  },
  container: {
    flex: 1,
    padding: 15,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  progressBarContainer: {
    height: 20,
    width: '100%',
    backgroundColor: 'lightgray',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#1E90FF',
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

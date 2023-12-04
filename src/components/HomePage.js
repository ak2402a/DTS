import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SurveyModal from './SurveyModal';
import { ref, onValue, set, query, orderByChild, equalTo } from "firebase/database";
import db from './FirebaseConfig/databaseSetup';
import TasksContext from './TasksContext';
import { Modal } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { fetchSurveyData, fetchTasksForSelectedDate, optimizeTasks, saveOptimizedTasks } from './optimizeTasks';


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
      // Show loading or some state to indicate processing
      // e.g., setLoading(true);
      
      // Retrieve the survey data and tasks for the selected date
      const surveyData = await fetchSurveyData();
      const tasksForSelectedDate = await fetchTasksForSelectedDate(selectedDate);
      
      // Check if survey data and tasks are retrieved successfully
      if (surveyData && tasksForSelectedDate.length > 0) {
        // Optimize tasks based on survey data and tasks
        const optimizedTasks = optimizeTasks(surveyData, tasksForSelectedDate);
        
        // Save the optimized tasks back to Firebase
        await saveOptimizedTasks(optimizedTasks);
        
        // Update the tasks in the context to reflect changes in the UI
        setTasks(optimizedTasks);
        
        // Show success message
        Alert.alert('Success', 'Tasks optimized successfully.');
      } else {
        // Handle the case where survey data or tasks are not available
        Alert.alert('Error', 'Could not retrieve survey data or tasks.');
      }
    } catch (error) {
      console.error('Optimization failed:', error);
      // Handle errors, possibly by showing an alert to the user
      Alert.alert('Error', 'Optimization failed. Please try again later.');
    } finally {
      // Hide loading state
      // e.g., setLoading(false);
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
        <Button title="Select Date" onPress={() => setCalendarVisible(true)} />
        <Button title="Optimize Schedule" onPress={handleOptimizeTasks} />

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
          keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
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

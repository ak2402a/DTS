import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const loadTasks = async () => {
      const tasksData = await AsyncStorage.getItem('tasks');
      if (tasksData !== null) {
        setTasks(JSON.parse(tasksData));
      }
    };

    loadTasks();
  }, []);

  const addTask = async (newTask) => {
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  return (
    <TasksContext.Provider value={{ tasks, addTask }}>
      {children}
    </TasksContext.Provider>
  );
};

export default TasksContext;

// TasksContext.js
import React, { createContext, useState, useEffect } from 'react';
import { ref, onValue, push, set } from "firebase/database";
import db from './FirebaseConfig/databaseSetup';

const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const tasksRef = ref(db, 'tasks/');
    const unsubscribe = onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      const loadedTasks = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      setTasks(loadedTasks);
    });

    return () => unsubscribe();
  }, []);

  const addTask = (newTask) => {
    console.log("Adding task:", newTask);
    const newTaskRef = push(ref(db, 'tasks'));
    set(newTaskRef, newTask);
  };

  return (
    <TasksContext.Provider value={{ tasks, setTasks, addTask }}>
      {children}
    </TasksContext.Provider>
  );
};
export default TasksContext;

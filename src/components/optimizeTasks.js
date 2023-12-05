// optimizeTasks.js
import { ref, get, query, orderByChild, equalTo, update } from "firebase/database";
import db from './FirebaseConfig/databaseSetup';

// Helper function to convert date and time strings to a JavaScript Date object
const convertToDateTime = (date, time) => {
    if (!date || !time) {
        console.error("Invalid input for date or time:", date, time);
        return null; // Invalid input handling
    }

    const dateTimeString = `${date}T${time}`;
    const dateTime = new Date(dateTimeString);

    if (isNaN(dateTime)) {
        console.error("Invalid DateTime created from:", dateTimeString);
        return null; // Invalid date handling
    }

    return dateTime;
};

// Helper function to calculate the end time of a task
const calculateEndTime = (startTime, duration) => {
  return new Date(startTime.getTime() + duration * 60000);
};

// Function to calculate mood score from the survey
const calculateMoodScore = (surveyData) => {
  let score = 0;
  score += surveyData.question1 === 'Yes' ? 2 : surveyData.question1 === 'Sometimes' ? 1 : 0;
  score += surveyData.question2 === 'Really Important' ? 2 : surveyData.question2 === 'Somewhat Important' ? 1 : 0;
  score += surveyData.question3 === 'Yes' ? 1 : 0;
  score += surveyData.question4 === 'Yes' ? 1 : 0;
  console.log("score: ",score)
  return score;
};

// Function to fetch survey data from Firebase
export const fetchSurveyData = async () => {
  const surveyDataRef = ref(db, 'surveyData');
  const snapshot = await get(surveyDataRef);
  return snapshot.exists() ? snapshot.val() : null;
};

// Function to fetch all tasks from Firebase
export const fetchAllTasks = async () => {
    const tasksRef = ref(db, 'tasks');
    const snapshot = await get(tasksRef);
  
    if (snapshot.exists()) {
      const tasksWithId = Object.entries(snapshot.val()).map(([id, task]) => {
        return { ...task, id }; // Merge the ID into the task object
      });
  
      console.log("Tasks with ID", tasksWithId);
      return tasksWithId;
    } else {
      return [];
    }
  };

// Function to find scheduled time slots
const findScheduledTimeSlots = (tasks) => {
  return tasks.map(task => {
    const startTime = convertToDateTime(task.date, task.time);
    const endTime = calculateEndTime(startTime, parseInt(task.duration, 10));
    return { startTime, endTime, task };
  });
};

const prioritizeTasks = (scheduledTimeSlots, allTasks, isHighPriority) => {
    console.log("Received tasks for prioritization:", allTasks.map(task => ({ id: task.id, date: task.date, time: task.time })));
    console.log("Received time slots:", scheduledTimeSlots);

    // Step 1: Sort tasks by priority (descending order)
    allTasks.sort((a, b) => b.priorityLevel - a.priorityLevel);

    // If it's low priority, reverse the order of tasks
    if (!isHighPriority) {
        allTasks.reverse();
    }

    // Step 2: Sort time slots
    // For high priority: earliest slots first; for low priority: latest slots first
    scheduledTimeSlots.sort((a, b) => isHighPriority ? a.startTime - b.startTime : b.startTime - a.startTime);

    // Step 3: Assign tasks to time slots
    allTasks.forEach((task, index) => {
        if (index < scheduledTimeSlots.length) {
            const slot = scheduledTimeSlots[index];
            console.log(`Assigning task ${task.id} to slot starting at ${formatDateTime(slot.startTime, 'date')} ${formatTime(slot.startTime)}`);
            task.date = formatDateTime(slot.startTime, 'date');
            task.time = formatTime(slot.startTime);
        } else {
            console.warn(`Not enough slots for task ${task.id}.`);
        }
    });

    console.log("Tasks after processing:", allTasks.map(task => ({ id: task.id, date: task.date, time: task.time })));
    return createUpdateObject(allTasks);
};

// Helper function to format date
const formatDateTime = (date, type) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    if (type === 'date') {
        return `${year}-${month}-${day}`;
    }
    // Add more formatting options as needed
};

  
  const canFitTask = (slot, taskDuration) => {
    const slotDuration = (slot.endTime - slot.startTime) / 60000; // Convert duration from ms to minutes
    return slotDuration >= taskDuration;
  };

  const formatTime = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
  
    // Pad the hours and minutes with leading zeros if they are less than 10
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
  
    return `${hours}:${minutes}`;
  };


// Function to sort tasks by priority
const sortTasksByPriority = (tasks, highToLow) => {
    // Create a copy of the tasks array to avoid modifying the original array
    const tasksCopy = [...tasks];
  
    // Sort the copied array
    tasksCopy.sort((a, b) => {
      return highToLow ? b.priorityLevel - a.priorityLevel : a.priorityLevel - b.priorityLevel;
    });
  
    return tasksCopy;
  };

// Function to create update object for Firebase
const createUpdateObject = (tasks) => {
  const updates = {};
  tasks.forEach(task => {
    updates[`/tasks/${task.id}`] = task;
  });
  return updates;
};

// Main function to optimize tasks
export const optimizeTasks = async (selectedDate) => {
    console.log("optimizing tasks")
  const surveyData = await fetchSurveyData();
  const allTasks = await fetchAllTasks();
  const moodScore = calculateMoodScore(surveyData);

  const tasksForSelectedDate = allTasks.filter(task => task.date === selectedDate);
  const scheduledTimeSlots = findScheduledTimeSlots(tasksForSelectedDate);


  let updates = {};
  switch (moodScore) {
    case 6:
      updates = prioritizeTasks(scheduledTimeSlots, allTasks, true);
      break;
    case 5:
      updates = prioritizeTasks(scheduledTimeSlots, allTasks, true);
      break;
    case 4:
      updates = sortTasksByPriority(tasksForSelectedDate, true);
      break;
    case 3:
      return; // Leave as is
    case 2:
      updates = sortTasksByPriority(tasksForSelectedDate, false);
      break;
    case 1:
      updates = prioritizeTasks(scheduledTimeSlots, allTasks, false);
      break;
      case 0:
      updates = prioritizeTasks(scheduledTimeSlots, allTasks, false);
      break;
  }
  console.log("Optimized: ",updates)

  return Object.values(updates);
};

export const saveOptimizedTasks = async (optimizedTasks) => {
    const updates = {};
    optimizedTasks.forEach(task => {
        // Ensure each task has an ID
        if (!task.id) {
            console.error("Missing task ID:", task);
            return;
        }
        updates[`/tasks/${task.id}`] = task;
    });

    if (Object.keys(updates).length > 0) {
        await update(ref(db), updates);
    }
};

export const updateTasksInFirebase = async (optimizedTasks) => {
    console.log("entered updatetasksinfirebase")
    const updates = {};
    optimizedTasks.forEach(task => {
        if (task.id) {
            updates[`/tasks/${task.id}`] = task;
        } else {
            console.error('Task missing ID:', task);
        }
    });
 
    if (Object.keys(updates).length > 0) {
        await update(ref(db), updates); // Perform the update in Firebase
    } else {
        console.log('No updates to perform');
    }
 };

import { ref, set, get, query, orderByChild, equalTo } from "firebase/database";
import db from './FirebaseConfig/databaseSetup';

// Function to calculate mood score from the survey
const calculateMoodScore = (surveyData) => {
  let score = 0;
  score += surveyData.question1 === 'Yes' ? 2 : surveyData.question1 === 'Sometimes' ? 1 : 0;
  score += surveyData.question2 === 'Really Important' ? 2 : surveyData.question2 === 'Somewhat Important' ? 1 : 0;
  score += surveyData.question3 === 'Yes' ? 1 : 0;
  score += surveyData.question4 === 'Yes' ? 1 : 0;
  return score;
};

// Function to fetch survey data from Firebase
export const fetchSurveyData = async () => {
  const surveyDataRef = ref(db, 'surveyData');
  const snapshot = await get(surveyDataRef);
  return snapshot.exists() ? snapshot.val() : null;
};

// Function to fetch tasks for the selected date from Firebase
export const fetchTasksForSelectedDate = async (selectedDate) => {
  const tasksRef = query(ref(db, 'tasks'), orderByChild('date'), equalTo(selectedDate));
  const snapshot = await get(tasksRef);
  return snapshot.exists() ? Object.values(snapshot.val()) : [];
};

// Function to sort and optimize tasks
export const optimizeTasks = (surveyData, tasks) => {
  const moodScore = calculateMoodScore(surveyData);
  // Sort tasks by priority level, then by duration based on mood score
  return tasks.sort((a, b) => {
    if (a.priorityLevel !== b.priorityLevel) {
      return b.priorityLevel - a.priorityLevel;
    }
    if (moodScore >= 5) {
      return b.duration - a.duration; // Longer tasks first if mood is high
    } else {
      return a.duration - b.duration; // Shorter tasks first if mood is low
    }
  });
};

// Function to save optimized tasks back to Firebase
export const saveOptimizedTasks = async (optimizedTasks) => {
  for (const task of optimizedTasks) {
    const taskRef = ref(db, `tasks/${task.id}`);
    await set(taskRef, task); // Save each task back to Firebase
  }
};
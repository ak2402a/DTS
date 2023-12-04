import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomePage from './src/components/HomePage';
import SchedulingPage from './src/components/SchedulingPage';
import SettingsPage from './src/components/SettingsPage';
import { TasksProvider } from './src/components/TasksContext'; 

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <TasksProvider> {
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline'; 
              } else if (route.name === 'Scheduling') {
                iconName = focused ? 'calendar' : 'calendar-outline';
              } else if (route.name === 'Settings') {
                iconName = focused ? 'settings' : 'settings-outline';
              }

              // Return the appropriate icon
              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
          tabBarOptions={{
            activeTintColor: 'blue',
            inactiveTintColor: 'gray',
          }}
        >
          <Tab.Screen name="Home" component={HomePage} />
          <Tab.Screen name="Scheduling" component={SchedulingPage} />
          <Tab.Screen name="Settings" component={SettingsPage} />
        </Tab.Navigator>
      </NavigationContainer>
    }
    </TasksProvider>
  );
}

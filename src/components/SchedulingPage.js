// SchedulingPage.js
import React from 'react';
import { View, Text, StyleSheet, Button, FlatList } from 'react-native';

const EVENTS = [
  { id: '1', time: '8am', title: 'Homework/Museum' },
  { id: '2', time: '10am', title: 'Classwork' },
  { id: '3', time: '3pm', title: 'Personal Project' },
  { id: '4', time: '5pm', title: 'Meeting/Call' },
  { id: '5', time: '7pm', title: 'Call' },
];

const SchedulingPage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Date: 10/17/23</Text>
      <FlatList
        data={EVENTS}
        renderItem={({ item }) => (
          <View style={styles.eventItem}>
            <Text style={styles.time}>{item.time}</Text>
            <Text style={styles.title}>{item.title}</Text>
          </View>
        )}
        keyExtractor={item => item.id}
      />
      <Button title="Go to Settings" onPress={() => navigation.navigate('Settings')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  eventItem: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  time: {
    fontSize: 18,
    width: 50,
  },
  title: {
    fontSize: 18,
  },
});

export default SchedulingPage;

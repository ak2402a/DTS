// HomePage.js
import React from 'react';
import { View, Text, StyleSheet, Button, FlatList } from 'react-native';

const DATA = [
  { id: '1', title: 'Task One' },
  { id: '2', title: 'Task Two' },
  { id: '3', title: 'Task Three' },
  { id: '4', title: 'Task Four' },
  { id: '5', title: 'Task Five' },
];

const HomePage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>TODAY</Text>
      <View style={styles.progressBar}>
        {/**/}
        <Text>Progress Level</Text>
      </View>
      <FlatList
        data={DATA}
        renderItem={({ item }) => <Text style={styles.taskItem}>{item.title}</Text>}
        keyExtractor={item => item.id}
      />
      <View style={styles.footer}>
        <Text>Home</Text>
        <Text>Menu</Text>
        <Text>Settings</Text>
      </View>
      <Button title="Go to Scheduling" onPress={() => navigation.navigate('Scheduling')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  progressBar: {
    height: 20,
    width: '100%',
    backgroundColor: 'lightgray',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskItem: {
    fontSize: 18,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default HomePage;
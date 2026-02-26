import { useState } from "react";
import { Button, ScrollView, Text, TextInput, View } from "react-native";
import {
    createTask,
    deleteTask,
    getAllTasks,
    updateTask,
} from "./taskRepository";

export default function TestScreen() {
  const [title, setTitle] = useState("");
  const [log, setLog] = useState("");

  function write(message) {
    setLog((prev) => prev + message + "\n");
  }

  async function testCreate() {
    try {
      const id = await createTask(title);
      write(`Created task with id: ${id}`);
    } catch (err) {
      write(`Create error: ${err.message}`);
    }
  }

  async function testRead() {
    try {
      const tasks = await getAllTasks();
      write("Tasks:\n" + JSON.stringify(tasks, null, 2));
    } catch (err) {
      write(`Read error: ${err.message}`);
    }
  }

  async function testUpdate() {
    try {
      const rows = await updateTask(1, {
        title: "Update Title",
        isComplete: true,
      });
      write(`Updated rows: ${rows}`);
    } catch (err) {
      write(`Update error: ${err.message}`);
    }
  }

  async function testDelete() {
    try {
      const rows = await deleteTask(1);
      write(`Delete rows: ${rows}`);
    } catch (err) {
      write(`Delete error: ${err.message}`);
    }
  }

  return (
    <View style={{ padding: 20, flex: 1 }}>
      <Text> CRUD Test Screen</Text>

      <TextInput
        placeholder="Task title"
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, padding: 8, marginVertical: 10 }}
      />

      <Button title="Create Task" onPress={testCreate} />
      <Button title="Read Tasks" onPress={testRead} />
      <Button title="Update Task (id=1)" onPress={testUpdate} />
      <Button title="Delete Task (id=1)" onPress={testDelete} />

      <ScrollView style={{ marginTop: 20, borderWidth: 1, padding: 10 }}>
        <Text>{log}</Text>
      </ScrollView>
    </View>
  );
}

import React, { useEffect, useState } from "react";
import { AppState, Button, StyleSheet, Text, TextInput } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { fetchWithRetry } from "../utils/fetchWithRetry";

export default function App() {
  const [text, setText] = useState("");
  const [count, setCount] = useState(0);
  const [appState, setAppState] = useState(AppState.currentState);

  async function loadData() {
    try {
      const response = await fetchWithRetry("https://example.com/api");
      const data = await response.json();
      console.log("Loaded", data);
    } catch (error) {
      console.error("Final failure:", error);
    }
  }

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      setAppState(nextState);
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>State Persistence & Error Resilience</Text>

        <TextInput
          style={styles.input}
          placeholder="Type something..."
          value={text}
          onChangeText={setText}
        />

        <Button title="Increase Count" onPress={() => setCount(count + 1)} />

        <Text style={styles.info}>Text: {text}</Text>
        <Text style={styles.info}>Count: {count}</Text>
        <Text style={styles.info}>AppState: {appState}</Text>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 20,
  },
  info: { marginTop: 10, fontSize: 16 },
});

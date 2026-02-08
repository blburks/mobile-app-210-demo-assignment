import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import { AppState, Button, StyleSheet, Text, View } from "react-native";

export default function Lifecycle() {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadState = async () => {
      const saved = await AsyncStorage.getItem("counter");
      if (saved) setCount(JSON.parse(saved));
    };
    loadState();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      // App goes to background → save state
      if (
        appState.current === "active" &&
        nextAppState.match(/inactive|background/)
      ) {
        AsyncStorage.setItem("counter", JSON.stringify(count));
      }

      // App returns to foreground → resume tasks
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("App is active again — resume tasks here");
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => subscription.remove();
  }, [count]);

  const simulateRequest = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    alert("Network request completed");
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lifecycle-Aware UI Demo</Text>

      <Text>Current AppState: {appStateVisible}</Text>

      <View style={{ height: 20 }} />

      <Text style={styles.counter}>Counter: {count}</Text>
      <Button title="Increment" onPress={() => setCount(count + 1)} />

      <View style={{ height: 20 }} />

      <Button
        title={loading ? "Loading..." : "Simulate Network Request"}
        onPress={simulateRequest}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
  },
  counter: {
    fontSize: 20,
    marginBottom: 10,
  },
});

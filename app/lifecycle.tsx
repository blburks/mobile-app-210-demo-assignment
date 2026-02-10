import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import { AppState, Button, StyleSheet, Text, View } from "react-native";

export default function Lifecycle() {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const startPolling = () => {
    if (pollingRef.current) return;
    pollingRef.current = setInterval(() => {
      console.log("Polling... app is active");
    }, 2000);
  };

  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
      console.log("Polling paused");
    }
  };

  useEffect(() => {
    const loadState = async () => {
      const saved = await AsyncStorage.getItem("counter");
      if (saved) setCount(JSON.parse(saved));
    };
    loadState();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      // App goes to background → save state + pause polling
      if (
        appState.current === "active" &&
        nextAppState.match(/inactive|background/)
      ) {
        AsyncStorage.setItem("counter", JSON.stringify(count));
        stopPolling();
      }

      // App returns to foreground → resume polling
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        startPolling();
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    // Start polling initially
    startPolling();

    return () => {
      subscription.remove();
      stopPolling();
    };
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

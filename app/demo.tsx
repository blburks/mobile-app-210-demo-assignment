import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useToast } from "@/components/toast-provider";
import { usePersistedState } from "@/hooks/use-persisted-state";
import { fetchWithRetry } from "@/utils/fetchWithRetry";
import { Image } from "expo-image";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, AppState, Button, StyleSheet } from "react-native";

export default function Demo() {
  // Track app state (active/background/inactive)
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  // Persisted state
  const [isRunning, setIsRunning] = usePersistedState<boolean>(
    "demo:isRunning",
    false,
  );
  const [loading, setLoading] = useState(false);
  const [todo, setTodo] = usePersistedState<any | null>("demo:lastTodo", null);

  const { show } = useToast();

  // Refs for polling and aborting
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const pausedByBackgroundRef = useRef(false);
  const startPollingRef = useRef<(() => void) | null>(null);
  const stopPollingRef = useRef<(() => void) | null>(null);

  // Fetch a single ToDo item
  const fetchTodoOnce = async () => {
    setLoading(true);
    controllerRef.current = new AbortController();

    try {
      const resp = await fetchWithRetry(
        "https://jsonplaceholder.typicode.com/todos/1",
        { signal: controllerRef.current.signal },
        3,
        1000,
      );

      const data = await resp.json();
      setTodo(data);
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Fetch aborted");
      } else {
        console.warn("Fetch error", err);
        show && show("Network error while fetching ToDo");
      }
    } finally {
      setLoading(false);
    }
  };

  // Start polling every 5 seconds
  const startPolling = () => {
    if (isRunning) return;
    setIsRunning(true);

    fetchTodoOnce();

    intervalRef.current = setInterval(() => {
      fetchTodoOnce();
    }, 5000);
  };

  const stopPolling = () => {
    setIsRunning(false);

    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  startPollingRef.current = startPolling;
  stopPollingRef.current = stopPolling;

  // Lifecycle handling
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        setAppStateVisible("active");
      } else {
        setAppStateVisible("background");
      }
    };

    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibility);
    }

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState.match(/inactive|background/)) {
        if (intervalRef.current) {
          pausedByBackgroundRef.current = true;
          stopPollingRef.current && stopPollingRef.current();
        }
      }

      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        if (pausedByBackgroundRef.current) {
          pausedByBackgroundRef.current = false;
          startPollingRef.current && startPollingRef.current();
        }
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
      if (typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", handleVisibility);
      }
      stopPollingRef.current && stopPollingRef.current();
    };
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image source={require("@/assets/images/partial-react-logo.png")} />
      }
    >
      <ThemedView>
        <ThemedText type="title">Demo</ThemedText>

        <ThemedView style={{ marginVertical: 10 }}>
          <Button
            title={
              isRunning ? "Stop Network Task" : "Start Network Task (ToDo)"
            }
            onPress={() => {
              if (isRunning) stopPolling();
              else startPolling();
            }}
          />
        </ThemedView>

        <ThemedText>App state: {appStateVisible}</ThemedText>

        <ThemedView style={{ marginTop: 12 }}>
          {loading && <ActivityIndicator />}
          {todo ? (
            <ThemedView style={styles.todoBox}>
              <ThemedText style={{ fontWeight: "bold" }}>
                Last fetched ToDo:
              </ThemedText>
              <ThemedText>User ID: {todo.userId}</ThemedText>
              <ThemedText>Title: {todo.title}</ThemedText>
              <ThemedText>
                Completed: {todo.completed ? "Yes" : "No"}
              </ThemedText>
            </ThemedView>
          ) : (
            <ThemedText>No ToDo fetched yet.</ThemedText>
          )}
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  todoBox: {
    marginTop: 8,
    padding: 8,
    borderRadius: 6,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
});

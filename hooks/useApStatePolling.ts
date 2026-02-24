import { useEffect, useRef } from "react";
import { AppState } from "react-native";

export function useAppStatePolling(
  callback: () => void,
  intervalMs: number = 2000,
) {
  const pollingRef = useRef<number | null>(null);
  const appState = useRef(AppState.currentState);

  const startPolling = () => {
    if (pollingRef.current !== null) return;
    pollingRef.current = setInterval(() => {
      callback();
    }, intervalMs);
  };

  const stopPolling = () => {
    if (pollingRef.current !== null) {
      clearInterval(pollingRef.current as number);
      pollingRef.current = null;
    }
  };

  useEffect(() => {
    // Start polling immediately when component mounts
    startPolling();

    const subscription = AppState.addEventListener("change", (nextState) => {
      const wasActive = appState.current === "active";
      const isNowActive = nextState === "active";

      // App goes to background - stop pollingRef
      if (wasActive && !isNowActive) {
        stopPolling();
      }

      // App returns to foreground - resume polling
      if (!wasActive && isNowActive) {
        startPolling();
      }

      appState.current = nextState;
    });

    return () => {
      subscription.remove();
      stopPolling();
    };
  }, []);
}

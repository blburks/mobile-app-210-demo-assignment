import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export function usePersistedState<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(initialValue);

  // Load from storage on mount
  useEffect(() => {
    const load = async () => {
      try {
        const saved = await AsyncStorage.getItem(key);
        if (saved !== null) {
          setState(JSON.parse(saved));
        }
      } catch (err) {
        console.warn("Failed to load persisted state:", err);
      }
    };

    load();
  }, [key]);

  // Save to storage whenever state changes
  useEffect(() => {
    const save = async () => {
      try {
        await AsyncStorage.setItem(key, JSON.stringify(state));
      } catch (err) {
        console.warn("Failed to save persisted state:", err);
      }
    };

    save();
  }, [key, state]);

  return [state, setState] as const;
}

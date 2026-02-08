import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Image } from "expo-image";
import React, { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";

export default function Demo() {
  const appState = useRef(AppState.currentState);
  console.log("appState", appState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    // Handle visibility change for web
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        // The web page is in the foreground and active.
        setAppStateVisible("active");
        console.log("App has come to the foreground/active state on Web.");
        // Use Case: Perform actions like refreshing data or re-authenticating.
      }
    });
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      console.log("nextAppState", nextAppState);
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("App has come to the foreground!");
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log("AppState", appState.current);
    });

    return () => {
      subscription.remove();
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
        <ThemedText>Demo Component</ThemedText>
        <ThemedText>Current state is: {appStateVisible}</ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

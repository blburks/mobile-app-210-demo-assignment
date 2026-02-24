import React from "react";
import { Text, View } from "react-native";
import Toast from "react-native-toast-message";

type ErrorBoundaryState = {
  hasError: boolean;
};

type ErrorBoundaryProps = {
  children?: React.ReactNode;
};

export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    Toast.show({
      type: "error",
      text1: "Something went wrong",
      text2: error.message,
    });
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ padding: 20 }}>
          <Text style={{ color: "red", fontSize: 18 }}>
            Something went wrong.
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

import { StyleSheet, Text, View } from "react-native";

export default function Demo() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Demo Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
  },
});

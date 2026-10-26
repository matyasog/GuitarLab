import { Text, View, StyleSheet } from "react-native";

// Placeholder until the theme (Phase 1) and the real screens (Phase 3) exist.
export default function Index() {
  return (
    <View style={styles.container}>
      <Text>GuitarLab</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

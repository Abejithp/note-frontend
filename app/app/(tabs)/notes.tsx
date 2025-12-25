import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function NotesPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Notes</Text>
      <TouchableOpacity style={styles.addButton}>
        <MaterialCommunityIcons name="plus" size={28} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.emptyText}>No notes yet. Create one to get started!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    marginTop: 16,
  },
});

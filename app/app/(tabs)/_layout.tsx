import { Tabs, TabSlot, TabList, TabTrigger} from "expo-router/ui";
import { usePathname } from "expo-router";
import { View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function TabsLayout() {
  const pathname = usePathname();

  const isActive = (route: string) =>
    pathname === `/(tabs)/${route}`;

  return (
    <Tabs>
      <TabSlot />

      <TabList asChild>
        <View style={styles.floatingNav}>
          <TabTrigger name="feed" href="/(tabs)/feed">
            <View style={[styles.item, isActive("feed") && styles.active]}>
              <MaterialCommunityIcons name="calendar" style={styles.label} />
            </View>
          </TabTrigger>

          <TabTrigger name="notes" href="/(tabs)/notes">
            <View style={[styles.item, isActive("notes") && styles.active]}>
              <MaterialCommunityIcons name="home" style={styles.label} />
            </View>
          </TabTrigger>

          <TabTrigger name="account" href="/(tabs)/account">
            <View style={[styles.item, isActive("account") && styles.active]}>
              <MaterialCommunityIcons name="account" style={styles.label} /> 
            </View>
          </TabTrigger>
        </View>
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  floatingNav: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,

    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",

    backgroundColor: "#111",
    borderRadius: 16,
    paddingVertical: 18,

    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,

    // Android shadow
    elevation: 10,
  },

  item: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },

  active: {
    backgroundColor: "#222",
  },

  label: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    textAlign:'center',
    width:'auto'
  },
});


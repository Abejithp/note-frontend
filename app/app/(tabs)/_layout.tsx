import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any = "help-circle";

          if (route.name === "feed") {
            iconName = "feed";
          } else if (route.name === "notes") {
            iconName = "note-multiple";
          } else if (route.name === "account") {
            iconName = "account";
          }

          return (
            <MaterialCommunityIcons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: "#E5E5EA",
          height: 60,
          paddingBottom: 8,
        },
      })}
    >
      <Tabs.Screen
        name="feed"
        options={{ title: "Feed" }}
      />
      <Tabs.Screen
        name="notes"
        options={{ title: "Notes" }}
      />
      <Tabs.Screen
        name="account"
        options={{ title: "Account" }}
      />
    </Tabs>
  );
}

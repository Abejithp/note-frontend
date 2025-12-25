import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";

interface NavbarProps {
  navigation: any;
  state: any;
}

export default function Navbar({ navigation, state }: NavbarProps) {
  const routes = [
    {
      name: "feed",
      label: "Feed",
      icon: "feed",
    },
    {
      name: "notes",
      label: "Notes",
      icon: "note-multiple",
    },
    {
      name: "account",
      label: "Account",
      icon: "account",
    },
  ];

  return (
    <View style={styles.navbar}>
      {routes.map((route, index) => {
        const isFocused = state.index === index;
        return (
          <View
            key={route.name}
            style={[
              styles.navItem,
              isFocused && styles.navItemActive,
            ]}
          >
            <MaterialCommunityIcons
              name={route.icon as any}
              size={24}
              color={isFocused ? "#007AFF" : "#999"}
              onPress={() => navigation.navigate(route.name)}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 60,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    backgroundColor: "#fff",
  },
  navItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  navItemActive: {
    borderTopWidth: 3,
    borderTopColor: "#007AFF",
  },
});

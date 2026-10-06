import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, // we render labels manually
        tabBarStyle: {
          position: "absolute",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 15,
          bottom: 25,
          left: 20,
          right: 20,
          backgroundColor: "#ffffff",
          borderRadius: 15,
          height: 70,
          ...styles.shadow,
        },
      }}
    >
      {/* Home -> app/(tabs)/index.tsx */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={28}
                color={focused ? "#6A3EA1" : "gray"}
              />
              <Text
                style={{ color: focused ? "#6A3EA1" : "gray", fontSize: 8 }}
              >
                Home
              </Text>
            </View>
          ),
        }}
      />

      {/* Finished -> app/(tabs)/finished.tsx */}
      <Tabs.Screen
        name="finished"
        options={{
          title: "Finished",
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Ionicons
                name={focused ? "checkmark-done" : "checkmark-done-outline"}
                size={28}
                color={focused ? "#6A3EA1" : "gray"}
              />
              <Text
                style={{ color: focused ? "#6A3EA1" : "gray", fontSize: 8 }}
              >
                Finished
              </Text>
            </View>
          ),
        }}
      />

      {/* New -> app/(tabs)/new.tsx (center + button) */}
      <Tabs.Screen
        name="new"
        options={{
          title: "News",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                top: -30,
              }}
            >
              <View
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 35,
                  backgroundColor: focused ? "#6A3EA1" : "gray",
                  alignItems: "center",
                  justifyContent: "center",
                  ...styles.shadow,
                }}
              >
                <Ionicons
                  name="add"
                  size={32}
                  color="white" // always visible
                />
              </View>
              <Text
                style={{
                  color: focused ? "#6A3EA1" : "gray",
                  fontSize: 8,
                  marginTop: 5,
                }}
              >
                News
              </Text>
            </View>
          ),
        }}
      />

      {/* Search -> app/(tabs)/search.tsx */}
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Ionicons
                name={focused ? "search" : "search-outline"}
                size={28}
                color={focused ? "#6A3EA1" : "gray"}
              />
              <Text
                style={{ color: focused ? "#6A3EA1" : "gray", fontSize: 8 }}
              >
                Search
              </Text>
            </View>
          ),
        }}
      />

      {/* Settings -> app/(tabs)/settings.tsx */}
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Ionicons
                name={focused ? "settings" : "settings-outline"}
                size={28}
                color={focused ? "#6A3EA1" : "gray"}
              />
              <Text
                style={{ color: focused ? "#6A3EA1" : "gray", fontSize: 8 }}
              >
                Settings
              </Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#7F5Df0",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});

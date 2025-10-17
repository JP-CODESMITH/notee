import { Ionicons } from "@expo/vector-icons"; // ✅ import Ionicons
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, View, Text } from "react-native"; // ✅ import View + Text
import finished from "./finished";
import HomeScreen from "./index";
import News from "./new";
import search from "./search";
import settings from "./settings";

const Tab = createBottomTabNavigator();

const Tabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, // ✅ we’ll handle labels manually
        tabBarStyle: {
          position: "absolute",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 15,
          bottom: 25,
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: "#ffffff",
          borderRadius: 15,
          height: 70,
          ...styles.shadow,
        },
      }}
    >
      {/* 🏠 Home */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
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

      {/* ✅ Finished */}
      <Tab.Screen
        name="Finished"
        component={finished}
        options={{
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
      <Tab.Screen
        name="News"
        component={News}
        options={{
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
                  color="white" // ✅ always visible
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
      {/* 🔍 Search */}
      <Tab.Screen
        name="Search"
        component={search}
        options={{
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

      {/* ⚙️ Settings */}
      <Tab.Screen
        name="Settings"
        component={settings}
        options={{
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
    </Tab.Navigator>
  );
};

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

export default Tabs;

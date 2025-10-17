import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useGlobalContext } from "../../context/globalContext";

export default function UsernameScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { setLogin, setHasSeenOnboarding } = useGlobalContext();
  useEffect(() => {
    const checkLogin = async () => {
      const loggedIn = await AsyncStorage.getItem("login");
      if (loggedIn === "true") {
        setIsLoggedIn(true);
      }
      setLoading(false);
    };
    checkLogin();
  }, []);

  if (loading) return null; // splash or spinner

  if (isLoggedIn) {
    // 🚀 User is already logged in → redirect away
    return <Redirect href="/(tabs)" />;
  }

  const handleLogin = async () => {
    try {
      // Save onboarding completion + username
      await AsyncStorage.setItem("hasSeenOnboarding", "true");
      await AsyncStorage.setItem("username", username);
      await AsyncStorage.setItem("login", "true");
      // Update global context
      setLogin(true);
      setHasSeenOnboarding(true);

      // Navigate to main tabs
      router.replace("/(tabs)");
    } catch (error) {
      console.log("Error saving onboarding state:", error);
    }
  };

  const isDisabled = username.trim() === "";

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 20,
        backgroundColor: "white",
      }}
    >
      <Text
        style={{
          fontSize: 30,
          fontWeight: "bold",
          color: "#6A3EA1",
          paddingBottom: 10,
        }}
      >
        Let’s Login
      </Text>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "600",
          color: "#6A3EA1",
          marginBottom: 10,
        }}
      >
        Input your username
      </Text>

      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
        placeholderTextColor="#999"
        style={{
          width: "100%",
          fontSize: 18,
          padding: 12,
          borderRadius: 50,
          borderColor: "#6A3EA1",
          borderWidth: 1,
          marginBottom: 20,
          color: "#6A3EA1",
        }}
        onSubmitEditing={() => {
          if (!username.trim()) {
            Alert.alert("Please type your username");
          } else {
            handleLogin();
          }
        }}
      />

      {/* Custom button */}
      <TouchableOpacity
        onPress={handleLogin}
        disabled={isDisabled}
        style={{
          position: "absolute",
          bottom: 60,
          width: "80%",
          left: "10%",
          backgroundColor: isDisabled ? "#ccc" : "#6A3EA1",
          padding: 15,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 90,
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            color: isDisabled ? "#666" : "white",
            fontSize: 16,
          }}
        >
          Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}

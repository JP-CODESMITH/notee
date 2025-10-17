import React from "react";
import { Image, TouchableOpacity, View, Text } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import Illustration from "../assets/images/Illustration2.png";
import task from "../assets/images/task.png";

export default function OnboardingScreen() {
  const router = useRouter();

  const handleFinish = async () => {
    try {
      // Save onboarding completion
      await AsyncStorage.setItem("hasSeenOnboarding", "true");
      // Navigate to tabs
      router.replace("/username");
    } catch (error) {
      console.log("Error saving onboarding state:", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Onboarding
        onSkip={handleFinish}
        onDone={handleFinish}
        pages={[
          {
            backgroundColor: "#6A3EA1",
            image: <Image source={Illustration} style={{ width: 200, height: 200 }} />,
            title: "Welcome to Notepad",
            subtitle: "Jot Down anything you want to achieve, today or in the future",
          },
          {
            backgroundColor: "#6A3EA1",
            image: <Image source={task} style={{ width: 200, height: 200 }} />,
            title: "Stay Organized",
            subtitle: "Keep track of all your ideas in one place.",
          },
        ]}
      />

      {/* Custom button */}
      <TouchableOpacity
        onPress={handleFinish}
        style={{
          position: "absolute",
          bottom: 60,
          width: "80%",
          left: "10%",
          backgroundColor: "white",
          padding: 15,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 90,
        }}
      >
        <Text style={{ fontWeight: "bold", color: "#6A3EA1" }}>Let’s Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

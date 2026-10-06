import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import "react-native-reanimated";
import AppProvider from "../context/globalContext";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { Inter_400Regular, Inter_900Black } from "@expo-google-fonts/inter";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
export const unstable_settings = { anchor: "(tabs)" };

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isLoading, setIsLoading] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [login, setLogin] = useState(false);
  const [fontloaded, fonterror] = useFonts({
    InterBold: Inter_900Black,
    InterRegular: Inter_400Regular,
  });
     useEffect(() => {
    if (fontloaded || fonterror) {
      SplashScreen.hideAsync();
    }
  }, [fontloaded, fonterror]);

  
  useEffect(() => {
    const initStorage = async () => {
      try {
        const data = await AsyncStorage.getItem("notesDB");
        if (!data) {
          const initialData = { idea: [], guidance: [], goals: [], routine:[],buying:[] };
          await AsyncStorage.setItem("notesDB", JSON.stringify(initialData));
        }
      } catch (e) {
        console.warn("Error initializing DB:", e);
      }
    };

    initStorage();
  }, []);

  useEffect(() => {
    const checkOnboarding = async () => {
      const seen = await AsyncStorage.getItem("hasSeenOnboarding");
      if (seen === "true") {
        setHasSeenOnboarding(true);
      }
      setIsLoading(false);
    };
    checkOnboarding();
    const checklog = async () => {
      const log = await AsyncStorage.getItem("login");
      if (log === "true") {
        setLogin(true);
      }
      setIsLoading(false);
    };
    checklog();
  }, []);

  if (isLoading) return null; // or splash screen

  return (
    <AppProvider>
      <Stack>
        {!hasSeenOnboarding && (
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        )}
        <Stack.Screen name="[auth]" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
        <Stack.Screen name="query" options={{ headerShown: false }} />
        <Stack.Screen name="buy" options={{ headerShown: false }} />
        <Stack.Screen name="idea" options={{ headerShown: false }} />
        <Stack.Screen name="guidance" options={{ headerShown: false }} />
        <Stack.Screen name="routine" options={{ headerShown: false }} />
        <Stack.Screen name="goals" options={{ headerShown: false }} />
      </Stack>
    </AppProvider>
  );
}

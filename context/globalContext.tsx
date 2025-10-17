import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface GlobalContextType {
  login: boolean;
  setLogin: (val: boolean) => void;
  hasSeenOnboarding: boolean;
  setHasSeenOnboarding: (val: boolean) => void;
  loading: boolean;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [login, setLogin] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadState = async () => {
      const storedLogin = await AsyncStorage.getItem("login");
      const storedOnboarding = await AsyncStorage.getItem("hasSeenOnboarding");
      if (storedLogin === "true") setLogin(true);
      if (storedOnboarding === "true") setHasSeenOnboarding(true);
      setLoading(false);
    };
    loadState();
  }, []);

  return (
    <GlobalContext.Provider value={{ login, setLogin, hasSeenOnboarding, setHasSeenOnboarding, loading }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default AppProvider;

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error("useGlobalContext must be used inside AppProvider");
  return context;
};

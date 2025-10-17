import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function settings() {
  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      <View
        style={{
          height: 60,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          justifyContent: "space-between",
          backgroundColor: "white",
        }}
      >
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color={"#6A3EA1"} />
          <Text
            style={{
              fontSize: 16,
              color: "#6A3EA1",
              marginLeft: 8,
              fontFamily: "InterRegular",
            }}
          >
            Back
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});

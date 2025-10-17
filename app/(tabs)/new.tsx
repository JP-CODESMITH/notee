import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Text, TouchableHighlight, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function News() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const loadUsername = async () => {
      try {
        const savedUsername = await AsyncStorage.getItem("username");
        if (savedUsername) {
          setUsername(savedUsername);
        }
      } catch (error) {
        console.log("Error loading username:", error);
      }
    };

    loadUsername();
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}
    >
      <StatusBar backgroundColor="white" />
      <View
        style={{
          height: 40,
          backgroundColor: "white",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          shadowOpacity: 0.25,
          shadowRadius: 3.5,
          elevation: 5,
          shadowColor: "black",
        }}
      >
        <Text
          
                      adjustsFontSizeToFit
                      numberOfLines={1}
          style={{
            width: "100%",
            fontSize: 25,
            fontFamily: "InterRegular",
            fontWeight: "100",
            paddingLeft: 10,
            textAlign: "center",
          }}
        >
          New Notes
        </Text>
      </View>
      <View
        style={{ width: "95%", height: 576, justifyContent: "space-between" }}
      >
        <View>
          <Text
            
                      adjustsFontSizeToFit
                      numberOfLines={1}
            style={{
              fontSize: 30,
              fontFamily: "InterBold",
              fontWeight: "bold",
              textAlign: "left",
              width: "80%",
            }}
          >
            What Do You Want to Notes?
          </Text>
        </View>
        <View style={{ height: 486, justifyContent: "space-between" }}>
          <TouchableHighlight
            style={{
              width: "100%",
              height: 75,
              backgroundColor: "#6A3EA1",
              borderRadius: 15,
            }}
            onPress={() => router.push("/idea")}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
                height: 75,
              }}
            >
              <View
                style={{
                  width: "20%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    margin: 14.5,
                    height: 46,
                    width: 46,
                    borderRadius: 100,
                    backgroundColor: "#3A2258",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons name="bulb" color={"white"} size={16.5} />
                </View>
              </View>
              <View
                style={{
                  width: "80%",
                  height: "100%",
                  justifyContent: "center",
                }}
              >
                <View style={{ width: "100%", flexDirection: "column" }}>
                  <View style={{ marginBottom: 8 }}>
                    <Text
                      adjustsFontSizeToFit
                      style={{
                        fontFamily: "InterBold",
                        fontWeight: "bold",
                        fontSize: 24,
                        color: "white",
                      }}
                    >
                      Interesting Idea
                    </Text>
                  </View>
                  <View>
                    <Text
                      
                      adjustsFontSizeToFit
                      numberOfLines={1}
                      style={{
                        fontFamily: "InterRegular",
                        fontWeight: "100",
                        fontSize: 17,
                        color: "white",
                      }}
                    >
                      Use free text area, feel free to write it all
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableHighlight>

          {/* Buying Something */}
          <TouchableOpacity
            style={{
              width: "100%",
              height: 75,
              backgroundColor: "#60D889",
              borderRadius: 15,
            }}
            onPress={() => router.push("/buy")}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
                height: 75,
              }}
            >
              <View
                style={{
                  width: "20%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    margin: 14.5,
                    height: 46,
                    width: 46,
                    borderRadius: 100,
                    backgroundColor: "#1F7F40",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons name="cart" size={16.5} color={"white"} />
                </View>
              </View>
              <View
                style={{
                  width: "80%",
                  height: "100%",
                  justifyContent: "center",
                }}
              >
                <View style={{ width: "100%", flexDirection: "column" }}>
                  <View style={{ marginBottom: 8 }}>
                    <Text
                      adjustsFontSizeToFit
                      style={{
                        fontFamily: "InterBold",
                        fontWeight: "bold",
                        fontSize: 24,
                        color: "white",
                      }}
                    >
                      Buying Something
                    </Text>
                  </View>
                  <View>
                    <Text
                      
                      adjustsFontSizeToFit
                      numberOfLines={1}
                      style={{
                        fontFamily: "InterRegular",
                        fontWeight: "100",
                        fontSize: 15,
                        color: "#1F7F40",
                      }}
                    >
                      Use checklist, so you won’t miss anything
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          {/* Goals */}
          <TouchableHighlight
            style={{
              width: "100%",
              height: 75,
              backgroundColor: "#F8C715",
              borderRadius: 15,
            }}
            onPress={() => router.push("/goals")}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
                height: 75,
              }}
            >
              <View
                style={{
                  width: "20%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    margin: 14.5,
                    height: 46,
                    width: 46,
                    borderRadius: 100,
                    backgroundColor: "#725A03",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons name="sparkles" color={"white"} size={16.5} />
                </View>
              </View>
              <View
                style={{
                  width: "80%",
                  height: "100%",
                  justifyContent: "center",
                }}
              >
                <View style={{ width: "100%", flexDirection: "column" }}>
                  <View style={{ marginBottom: 8 }}>
                    <Text
                      
                      adjustsFontSizeToFit
                      numberOfLines={1}
                      style={{
                        fontFamily: "InterBold",
                        fontWeight: "bold",
                        fontSize: 24,
                        color: "white",
                      }}
                    >
                      Goals
                    </Text>
                  </View>
                  <View>
                    <Text
                      
                      adjustsFontSizeToFit
                      numberOfLines={1}
                      style={{
                        fontFamily: "InterRegular",
                        fontWeight: "100",
                        fontSize: 16,
                        color: "#725A03",
                      }}
                    >
                      Near/future goals, notes and keep focus
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableHighlight>
          {/* Guidance */}
          <TouchableHighlight
            style={{
              width: "100%",
              height: 75,
              backgroundColor: "#CE3A54",
              borderRadius: 15,
            }}
            onPress={() => router.push("/guidance")}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
                height: 75,
              }}
            >
              <View
                style={{
                  width: "20%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    margin: 14.5,
                    height: 46,
                    width: 46,
                    borderRadius: 100,
                    backgroundColor: "#5A1623",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons name="clipboard" color={"white"} size={16.5} />
                </View>
              </View>
              <View
                style={{
                  width: "80%",
                  height: "100%",
                  justifyContent: "center",
                }}
              >
                <View style={{ width: "100%", flexDirection: "column" }}>
                  <View style={{ marginBottom: 8 }}>
                    <Text
                      
                      adjustsFontSizeToFit
                      numberOfLines={1}
                      style={{
                        fontFamily: "InterBold",
                        fontWeight: "bold",
                        fontSize: 24,
                        color: "white",
                      }}
                    >
                      Guidance
                    </Text>
                  </View>
                  <View>
                    <Text
                      
                      adjustsFontSizeToFit
                      numberOfLines={1}
                      style={{
                        fontFamily: "InterRegular",
                        fontWeight: "100",
                        fontSize: 17,
                        color: "white",
                      }}
                    >
                      Create guidance for routine activities
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableHighlight>
          {/* Routine Tasks */}
          <TouchableHighlight
            style={{
              width: "100%",
              height: 75,
              backgroundColor: "#DEDC52",
              borderRadius: 15,
            }}
            onPress={() => router.push("/routine")}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
                height: 75,
              }}
            >
              <View
                style={{
                  width: "20%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    margin: 14.5,
                    height: 46,
                    width: 46,
                    borderRadius: 100,
                    backgroundColor: "#565510",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons name="journal" size={16.5} color={"white"} />
                </View>
              </View>
              <View
                style={{
                  width: "80%",
                  height: "100%",
                  justifyContent: "center",
                }}
              >
                <View style={{ width: "100%", flexDirection: "column" }}>
                  <View style={{ marginBottom: 8 }}>
                    <Text
                      
                      adjustsFontSizeToFit
                      numberOfLines={1}
                      style={{
                        fontFamily: "InterBold",
                        fontWeight: "bold",
                        fontSize: 24,
                        color: "white",
                      }}
                    >
                      Routine Tasks
                    </Text>
                  </View>
                  <View>
                    <Text
                      
                      adjustsFontSizeToFit
                      numberOfLines={1}
                      style={{
                        fontFamily: "InterRegular",
                        fontWeight: "100",
                        fontSize: 17,
                        color: "#565510",
                      }}
                    >
                      Checklist with sub-checklist
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    </SafeAreaView>
  );
}

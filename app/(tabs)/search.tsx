import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

// ✅ Define the Note type
interface Note {
  id: string;
  title?: string;
  rich?: string;
  backgroundColor?: string;
  pin?: boolean;
  finished?: boolean;
  category?: string;
}

export default function Search() {
  // ✅ Use the Note type in useState
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<Note[]>([]);


  const loadNotes = async () => {
    try {
      const storedData = await AsyncStorage.getItem("notesDB");

      if (storedData) {
        const data = JSON.parse(storedData);

        // Combine all categories into one big array
        const combinedNotes: Note[] = [
          ...(data.idea || []),
          ...(data.buy || []),
          ...(data.routine || []),
          ...(data.goals || []),
          ...(data.guidance || []),
        ];

        setAllNotes(combinedNotes);
        setSearchResults(combinedNotes);
      }
    } catch (error) {
      console.log("Error loading notes:", error);
    }
  };

  const handleSearch = (text: string) => {
    setSearchText(text);

    if (text === "") {
      setSearchResults(allNotes);
      return;
    }

    const results = allNotes.filter((note) => {
      const titleMatch = note.title?.toLowerCase().includes(text.toLowerCase());
      const cleanContent = note.rich?.replace(/<[^>]*>/g, "") || "";
      const contentMatch = cleanContent
        .toLowerCase()
        .includes(text.toLowerCase());
      return titleMatch || contentMatch;
    });

    setSearchResults(results);

  };

  useEffect(() => {
    loadNotes();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
              <View
          style={{
            backgroundColor: "white",
            paddingHorizontal: 16,
            paddingTop: 10,
            paddingBottom: 10,
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            position: "absolute",
            width: "100%",
            height: 100,
            alignItems: "center",
            justifyContent: "flex-end",
            zIndex: 5,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity onPress={() => Keyboard.dismiss()}>
              <Ionicons name="arrow-back-outline" size={24} color="#000" />
            </TouchableOpacity>

            <TextInput
              style={{
                flex: 1,
                height: 40,
                backgroundColor: "#f5f5f5",
                borderRadius: 10,
                paddingHorizontal: 15,
                fontSize: 16,
                marginHorizontal: 10,
                fontFamily:"InterBold"
              }}
              value={searchText}
              onChangeText={handleSearch}
              autoFocus={true}
              placeholder="Search your notes..."
              placeholderTextColor="#999"
              returnKeyType="search"
            />
          </View>
        </View>
      <ScrollView>
        {/* Header with Search Bar */}


        {/* Search Results List */}
        <View style={{ flex: 1, padding: 16, paddingTop: 70 }}>
          <>
          <Text>Search Result</Text>
          
          <Animated.FlatList
            data={searchResults}
            keyExtractor={(item) => item.id || Math.random().toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 20,
              marginBottom:100
            }}
            renderItem={({ item }) => (
              <View
                style={{
                  backgroundColor: item.backgroundColor || "#f5f5f5",
                  padding: 15,
                  marginBottom: 10,
                  borderRadius: 10,
                  borderLeftWidth: 4,
                  borderLeftColor: "#6A3EA1",
                }}
              >
                <Text
                  style={{ fontWeight: "bold", fontSize: 16, marginBottom: 5, fontFamily:"interbold" }}
                >
                  {item.title || "Untitled Note"}
                </Text>
                <Text numberOfLines={3} style={{ color: "#666", fontSize: 14, fontFamily:"InterRegular" }}>
                  {item.rich?.replace(/<[^>]*>/g, "").substring(0, 150) ||
                    "No content"}
                </Text>

                <View style={{ flexDirection: "row", marginTop: 8 }}>
                  {item.pin && (
                    <Text
                      style={{
                        color: "#6A3EA1",
                        fontSize: 12,
                        marginRight: 10,
                      }}
                    >
                      📌 Pinned
                    </Text>
                  )}
                  {item.finished && (
                    <Text style={{ color: "green", fontSize: 12 }}>
                      ✅ Finished
                    </Text>
                  )}
                </View>
              </View>
            )}
            ListEmptyComponent={
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 100,
                }}
              >
                <Ionicons name="search-outline" size={64} color="#ccc" />
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 20,
                    fontSize: 16,
                    color: "#666",
                    fontFamily: "InterBold"
                  }}
                >
                  {searchText
                    ? "No notes found matching your search"
                    : "No notes available"}
                </Text>

              </View>
            }
            ListHeaderComponent={
              searchText ? (
                <Text style={{ marginBottom: 10, color: "#666", fontFamily:"InterBold" }}>
                  Found {searchResults.length} result
                  {searchResults.length !== 1 ? "s" : ""}
                </Text>
              ) : null
            }
          />
          </>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

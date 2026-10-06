import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  allNotes,
  getBackgroundColor,
  loadDB,
  searchableText,
  stripHtml,
  getRichText,
  type Note,
} from '../../lib/notes';

export default function Search() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<Note[]>([]);

  const refresh = useCallback(async () => {
    const db = await loadDB();
    const combined = allNotes(db);
    setNotes(combined);
    setSearchResults((prev) => {
      if (!searchText) return combined;
      const q = searchText.toLowerCase();
      return combined.filter((n) => searchableText(n).includes(q));
    });
  }, [searchText]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text === '') {
      setSearchResults(notes);
      return;
    }
    const q = text.toLowerCase();
    setSearchResults(notes.filter((n) => searchableText(n).includes(q)));
  };

  const openNote = (item: Note) => {
    const category =
      (item.type as string) || (item.category as string) || 'idea';
    router.push({
      pathname: '/query/[id]',
      params: { id: String(item.id), type: category },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View
        style={{
          backgroundColor: 'white',
          paddingHorizontal: 16,
          paddingTop: 10,
          paddingBottom: 10,
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          width: '100%',
          zIndex: 5,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Dismiss keyboard"
            onPress={() => Keyboard.dismiss()}
          >
            <Ionicons name="arrow-back-outline" size={24} color="#000" />
          </TouchableOpacity>

          <TextInput
            style={{
              flex: 1,
              height: 40,
              backgroundColor: '#f5f5f5',
              borderRadius: 10,
              paddingHorizontal: 15,
              fontSize: 16,
              marginHorizontal: 10,
              fontFamily: 'InterRegular',
            }}
            value={searchText}
            onChangeText={handleSearch}
            autoFocus={true}
            placeholder="Search your notes..."
            placeholderTextColor="#999"
            returnKeyType="search"
            accessibilityLabel="Search your notes"
          />
        </View>
      </View>

      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontFamily: 'InterBold', fontSize: 15, marginBottom: 8 }}>
          Search Result
        </Text>

        <FlatList
          data={searchResults}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => {
            const preview =
              stripHtml(getRichText(item)).substring(0, 150) || 'No content';
            return (
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={`Open ${item.title || 'untitled note'}`}
                onPress={() => openNote(item)}
                style={{
                  backgroundColor: getBackgroundColor(item),
                  padding: 15,
                  marginBottom: 10,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                }}
              >
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 16,
                    marginBottom: 5,
                    fontFamily: 'InterBold',
                  }}
                >
                  {item.title || 'Untitled Note'}
                </Text>
                <Text
                  numberOfLines={3}
                  style={{
                    color: '#666',
                    fontSize: 14,
                    fontFamily: 'InterRegular',
                  }}
                >
                  {preview}
                </Text>

                <View style={{ flexDirection: 'row', marginTop: 8 }}>
                  {item.pin ? (
                    <Text
                      style={{
                        color: '#6A3EA1',
                        fontSize: 12,
                        marginRight: 10,
                      }}
                    >
                      Pinned
                    </Text>
                  ) : null}
                  {item.finished ? (
                    <Text style={{ color: 'green', fontSize: 12 }}>
                      Finished
                    </Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 100,
              }}
            >
              <Ionicons name="search-outline" size={64} color="#ccc" />
              <Text
                style={{
                  textAlign: 'center',
                  marginTop: 20,
                  fontSize: 16,
                  color: '#666',
                  fontFamily: 'InterBold',
                }}
              >
                {searchText
                  ? 'No notes found matching your search'
                  : 'No notes available'}
              </Text>
            </View>
          }
          ListHeaderComponent={
            searchText ? (
              <Text
                style={{
                  marginBottom: 10,
                  color: '#666',
                  fontFamily: 'InterBold',
                }}
              >
                Found {searchResults.length} result
                {searchResults.length !== 1 ? 's' : ''}
              </Text>
            ) : null
          }
        />
      </View>
    </SafeAreaView>
  );
}

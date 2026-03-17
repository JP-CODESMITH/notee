import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Checkbox } from 'react-native-paper';
import RenderHTML from 'react-native-render-html';
import { SafeAreaView } from 'react-native-safe-area-context'; // @ts-ignore
import direction from '../../assets/images/Direction.png'; // @ts-ignore
import illustration from '../../assets/images/Illustration.png';

export default function HomeScreen() {
  const [notes, setNotes] = useState<any[]>([]);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [selectedPins, setSelectedPins] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelectedNotes((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id],
    );
  };

  const toggleSelectPin = (id: string) => {
    setSelectedPins((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id],
    );
  };

  const deleteSelected = async () => {
    const dbString = await AsyncStorage.getItem('notesDB');
    const db = dbString ? JSON.parse(dbString) : {};

    const updated = notes.filter((n) => !selectedNotes.includes(n.id));

    db.idea = updated.filter((n) => (n.type || n.category) === 'idea');
    db.buying = updated.filter((n) => (n.type || n.category) === 'buying');
    db.routine = updated.filter((n) => (n.type || n.category) === 'routine');
    db.goals = updated.filter((n) => (n.type || n.category) === 'goals');
    db.guidance = updated.filter((n) => (n.type || n.category) === 'guidance');

    setNotes(updated);
    setSelectedNotes([]);
    await AsyncStorage.setItem('notesDB', JSON.stringify(db));
  };

  const deleteSelectedPin = async () => {
    const dbString = await AsyncStorage.getItem('notesDB');
    const db = dbString ? JSON.parse(dbString) : {};

    const updated = notes.filter((n) => !selectedPins.includes(n.id));

    db.idea = updated.filter((n) => (n.type || n.category) === 'idea');
    db.buying = updated.filter((n) => (n.type || n.category) === 'buying');
    db.routine = updated.filter((n) => (n.type || n.category) === 'routine');
    db.goals = updated.filter((n) => (n.type || n.category) === 'goals');
    db.guidance = updated.filter((n) => (n.type || n.category) === 'guidance');

    setNotes(updated);
    setSelectedPins([]);
    await AsyncStorage.setItem('notesDB', JSON.stringify(db));
  };

  const pinSelected = async () => {
    const dbString = await AsyncStorage.getItem('notesDB');
    const db = dbString ? JSON.parse(dbString) : {};

    const updated = notes.map((n) =>
      selectedNotes.includes(n.id) ? { ...n, pin: true } : n,
    );

    db.idea = updated.filter((n) => (n.type || n.category) === 'idea');
    db.buying = updated.filter((n) => (n.type || n.category) === 'buying');
    db.routine = updated.filter((n) => (n.type || n.category) === 'routine');
    db.goals = updated.filter((n) => (n.type || n.category) === 'goals');
    db.guidance = updated.filter((n) => (n.type || n.category) === 'guidance');

    setNotes(updated);
    setSelectedNotes([]);
    await AsyncStorage.setItem('notesDB', JSON.stringify(db));
  };

  const pinSelectedPin = async () => {
    const dbString = await AsyncStorage.getItem('notesDB');
    const db = dbString ? JSON.parse(dbString) : {};

    const updated = notes.map((n) =>
      selectedPins.includes(n.id) ? { ...n, pin: false } : n,
    );

    db.idea = updated.filter((n) => (n.type || n.category) === 'idea');
    db.buying = updated.filter((n) => (n.type || n.category) === 'buying');
    db.routine = updated.filter((n) => (n.type || n.category) === 'routine');
    db.goals = updated.filter((n) => (n.type || n.category) === 'goals');
    db.guidance = updated.filter((n) => (n.type || n.category) === 'guidance');
    setNotes(updated);
    setSelectedPins([]);
    await AsyncStorage.setItem('notesDB', JSON.stringify(db));
  };

  const finishedNote = async () => {
    const dbString = await AsyncStorage.getItem('notesDB');
    const db = dbString ? JSON.parse(dbString) : {};

    const updated = notes.map((n) =>
      selectedNotes.includes(n.id) || selectedPins.includes(n.id)
        ? { ...n, finished: true }
        : n,
    );

    db.idea = updated.filter((n) => (n.type || n.category) === 'idea');
    db.buying = updated.filter((n) => (n.type || n.category) === 'buying');
    db.routine = updated.filter((n) => (n.type || n.category) === 'routine');
    db.goals = updated.filter((n) => (n.type || n.category) === 'goals');
    db.guidance = updated.filter((n) => (n.type || n.category) === 'guidance');

    setNotes(updated);
    setSelectedNotes([]);
    setSelectedPins([]);
    await AsyncStorage.setItem('notesDB', JSON.stringify(db));
  };

  useFocusEffect(
    React.useCallback(() => {
      const loadNotes = async () => {
        const dbString = await AsyncStorage.getItem('notesDB');
        if (dbString) {
          const db = JSON.parse(dbString);
          setNotes([
            ...(db.idea || []),
            ...(db.buying || []),
            ...(db.routine || []),
            ...(db.goals || []),
            ...(db.guidance || []),
          ]);

          console.log(dbString);
        } else {
          setNotes([]);
        }
      };
      // @ts-ignore
      loadNotes();
      return () => {};
    }, []),
  );

  const toggleTodo = async (noteId: string, todoId: string) => {
    const updated = notes.map((n) => {
      if (n.id === noteId) {
        return {
          ...n,
          rich: n.rich.map((t: any) =>
            t.id === todoId ? { ...t, checked: !t.checked } : t,
          ),
        };
      }
      return n;
    });

    setNotes(updated);

    const dbString = await AsyncStorage.getItem('notesDB');
    if (dbString) {
      const db = JSON.parse(dbString);
      const note = updated.find((n) => n.id === noteId);

      if (note) {
        const category = note.type || note.category || 'idea';
        db[category] = updated.filter(
          (n) => (n.type || n.category) === category,
        );
        await AsyncStorage.setItem('notesDB', JSON.stringify(db));
      }
    }
  };

  const pinnedNotes = notes.filter(
    (item) => item.pin === true && item.finished === false,
  );
  const regularNotes = notes.filter(
    (item) => item.finished === false && item.pin === false,
  );
  const pinnedCount = pinnedNotes.length;
  const regularCount = regularNotes.length;

  const getBackground = (color: string) => {
    switch (color) {
      case '#C8C5CB':
        return '#4B5563';
      case '#EFE9F7':
        return '#6A3EA1';
      case '#F7DEE3':
        return '#BE185D';
      case '#DAF6E4':
        return '#059669';
      case '#FDEBAB':
        return '#CA8A04';
      case '#F7F6D4':
        return '#A16207';
      case '#EFEEF0':
        return '#4B5563';
      case 'white':
        return '#6B7280';
      default:
        return color || '#6B7280';
    }
  };

  return (
    <SafeAreaView
      style={{ backgroundColor: '#FAF8FC0', flex: 1, gap: 48, padding: 5 }}
    >
      {regularCount === 0 && pinnedCount === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
          }}
        >
          <Image
            source={illustration}
            style={{
              width: 200,
              height: 200,
              resizeMode: 'contain',
              marginTop: 20,
            }}
          />
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 35,
              fontFamily: 'InterBold',
              textAlign: 'center',
            }}
          >
            Start Your Journey
          </Text>
          <View style={{ width: 280 }}>
            <Text
              style={{
                fontSize: 15,
                fontWeight: '100',
                textAlign: 'center',
                fontFamily: 'InterRegular',
              }}
            >
              Every big step starts with a small step. Note your first idea and
              start your journey!
            </Text>
          </View>
          <View style={{ width: 200, alignItems: 'flex-end', paddingTop: 50 }}>
            <Image source={direction} />
          </View>
        </View>
      ) : (
        <ScrollView style={{ backgroundColor: '#FAF8FC0', flex: 1 }}>
          {/* ----- Pinned Notes ----- */}
          {pinnedCount > 0 && (
            <View>
              <View
                style={{
                  marginTop: 34,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontFamily: 'InterBold',
                    fontSize: 15,
                    fontWeight: 'bold',
                  }}
                >
                  Pinned Notes
                </Text>
                <TouchableOpacity>
                  <Text style={{ color: '#6A3EA1' }}>View all</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                data={pinnedNotes}
                horizontal
                contentContainerStyle={{
                  gap: 10,
                  maxHeight: 260,
                  paddingLeft: 20,
                }}
                keyExtractor={(item) =>
                  item.id?.toString() || Math.random().toString()
                }
                renderItem={({ item }) => {
                  const isSelected = selectedPins.includes(item.id);

                  return (
                    <Link
                      href={{
                        pathname: '../query/[id]',
                        params: {
                          id: item.id,
                          type: item.type || item.category,
                        },
                      }}
                      asChild
                    >
                      <TouchableOpacity
                        onLongPress={() => toggleSelectPin(item.id)}
                        activeOpacity={0.8}
                      >
                        <View
                          style={{
                            backgroundColor: item.backgroundcolor || '#f5f5f5',
                            marginVertical: 8,
                            borderRadius: 10,
                            height: 252,
                            width: 180,
                            padding: 8,
                            overflow: 'hidden',
                            borderWidth: isSelected ? 3 : 0,
                            borderColor: isSelected ? '#6A3EA1' : 'transparent',
                            opacity: isSelected ? 0.7 : 1,
                          }}
                        >
                          <Text
                            style={{
                              fontWeight: 'bold',
                              fontSize: 18,
                              marginBottom: 5,
                            }}
                          >
                            {item.title || 'Untitled Note'}
                          </Text>

                          {(item.type === 'buying' ||
                            item.category === 'buying') &&
                          Array.isArray(item.rich) ? (
                            <View>
                              {item.rich.map((todo: any) => (
                                <View
                                  key={todo.id}
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginBottom: 4,
                                  }}
                                >
                                  <Checkbox
                                    status={
                                      todo.checked ? 'checked' : 'unchecked'
                                    }
                                    onPress={() => toggleTodo(item.id, todo.id)}
                                  />
                                  <Text style={{ flex: 1, flexWrap: 'wrap' }}>
                                    {todo.text}
                                  </Text>
                                </View>
                              ))}
                            </View>
                          ) : (
                            <RenderHTML
                              contentWidth={180}
                              source={{
                                html:
                                  typeof item.rich === 'string'
                                    ? item.rich
                                    : '<p>No content</p>',
                              }}
                            />
                          )}

                          <View
                            style={{
                              position: 'absolute',
                              backgroundColor: getBackground(
                                item.backgroundcolor || '#f5f5f5',
                              ),
                              bottom: 0,
                              left: 0,
                              width: '110%',
                              height: 28,
                              paddingLeft: 20,
                              justifyContent: 'center',
                            }}
                          >
                            <Text style={{ color: 'white' }}>
                              {item.type === 'buying' ||
                              item.category === 'buying'
                                ? 'Checklist'
                                : 'Interesting Ideas'}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </Link>
                  );
                }}
              />
            </View>
          )}

          {/* ----- Regular Notes ----- */}
          {regularCount > 0 && (
            <View style={{ marginTop: 20 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontFamily: 'InterBold',
                    fontSize: 15,
                    fontWeight: 'bold',
                  }}
                >
                  Interesting Ideas
                </Text>
                <TouchableOpacity>
                  <Text style={{ color: '#6A3EA1' }}>View all</Text>
                </TouchableOpacity>
              </View>
              <View>
                <FlatList
                  data={regularNotes}
                  numColumns={2}
                  contentContainerStyle={{
                    gap: 10,
                    padding: 10,
                    marginBottom: 500,
                  }}
                  columnWrapperStyle={{ gap: 10 }}
                  keyExtractor={(item) =>
                    item.id?.toString() || Math.random().toString()
                  }
                  keyboardDismissMode={'on-drag'}
                  renderItem={({ item }) => {
                    const isSelected = selectedNotes.includes(item.id);
                    return (
                      <Link
                        href={{
                          pathname: '../query/[id]',
                          params: {
                            id: item.id,
                            type: item.type || item.category,
                          },
                        }}
                        asChild
                      >
                        <TouchableOpacity
                          onLongPress={() => toggleSelect(item.id)}
                          activeOpacity={0.8}
                          style={{ width: '48%' }}
                        >
                          <View
                            style={{
                              backgroundColor:
                                item.backgroundColor ||
                                item.backgroundcolor ||
                                '#f5f5f5',
                              marginVertical: 8,
                              borderRadius: 10,
                              height: 252,
                              padding: 8,
                              margin: 8,
                              overflow: 'hidden',
                              borderWidth: isSelected ? 3 : 0,
                              borderColor: isSelected
                                ? '#6A3EA1'
                                : 'transparent',
                              opacity: isSelected ? 0.7 : 1,
                            }}
                          >
                            <Text
                              style={{
                                fontWeight: 'bold',
                                fontSize: 18,
                                marginBottom: 5,
                              }}
                            >
                              {item.title || 'Untitled Note'}
                            </Text>
                            {(item.type === 'buying' ||
                              item.category === 'buying') &&
                            Array.isArray(item.rich) ? (
                              <View>
                                {item.rich.map((todo: any) => (
                                  <View
                                    key={todo.id}
                                    style={{
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      marginBottom: 4,
                                    }}
                                  >
                                    <Checkbox
                                      status={
                                        todo.checked ? 'checked' : 'unchecked'
                                      }
                                      onPress={() =>
                                        toggleTodo(item.id, todo.id)
                                      }
                                    />
                                    <Text style={{ flex: 1, flexWrap: 'wrap' }}>
                                      {todo.text}
                                    </Text>
                                  </View>
                                ))}
                              </View>
                            ) : null}
                            {String(item.type) === 'idea' ? (
                              <RenderHTML
                                contentWidth={180}
                                source={{
                                  html:
                                    typeof item.rich === 'string'
                                      ? item.rich
                                      : '<p>No content</p>',
                                }}
                              />
                            ) : null}
                            {String(item.type) === 'goals' ? (
                              <>
                                <Text>text</Text>
                              </>
                            ) : null}
                          </View>
                        </TouchableOpacity>
                      </Link>
                    );
                  }}
                />
              </View>
            </View>
          )}
        </ScrollView>
      )}

      {/* Action buttons for selected notes */}
      {selectedNotes.length > 0 && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            padding: 10,
            position: 'absolute',
            bottom: 90,
            width: '100%',
          }}
        >
          <TouchableOpacity onPress={pinSelected}>
            <Text style={{ color: 'green', fontSize: 20 }}>📌 Pin</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={finishedNote}>
            <Text style={{ color: 'green', fontSize: 20 }}>✅ Finished</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={deleteSelected}>
            <Text style={{ color: 'red', fontSize: 20 }}>🗑 Delete</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Action buttons for selected pinned notes */}
      {selectedPins.length > 0 && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            padding: 10,
            position: 'absolute',
            bottom: 90,
            width: '100%',
          }}
        >
          <TouchableOpacity onPress={pinSelectedPin}>
            <Text style={{ color: 'green', fontSize: 20 }}>📌 unPin</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={deleteSelectedPin}>
            <Text style={{ color: 'red', fontSize: 20 }}>🗑 Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

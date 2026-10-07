import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import direction from '../../assets/images/Direction.png';
import illustration from '../../assets/images/Illustration3.png';
import sit from '../../assets/images/sit.png';
import NoteCardPreview from '../../components/NoteCardPreview';
import { ACTION_BAR_BOTTOM, TAB_BAR_CLEARANCE } from '../../constants/layout';

export default function Finished() {
  const [notes, setNotes] = useState<any[]>([]);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);

  // 🔹 Load all notes
  useFocusEffect(
    React.useCallback(() => {
      const loadNotes = async () => {
        const dbString = await AsyncStorage.getItem('notesDB');
        if (dbString) {
          const db = JSON.parse(dbString);
          setNotes([
            ...(db.idea || []),
            ...(db.buying || []),
            ...(db.buy || []),
            ...(db.routine || []),
            ...(db.goals || []),
            ...(db.guidance || []),
          ]);
        } else {
          setNotes([]);
        }
      };

      loadNotes();
      return () => {};
    }, []),
  );

  const finishedNotes = notes.filter((item) => item.finished === true);
  const countedNotes = finishedNotes.length;

  const toggleSelect = (id: string) => {
    setSelectedNotes((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id],
    );
  };

  // 🔹 Update DB safely without wiping other categories
  const updateDB = async (updatedNotes: any[]) => {
    const dbString = await AsyncStorage.getItem('notesDB');
    const db = dbString
      ? JSON.parse(dbString)
      : { idea: [], buying: [], routine: [], goals: [], guidance: [] };

    // rebuild categories from updatedNotes
    const catOf = (n: any) => n.type || n.category || 'idea';
    db.idea = updatedNotes.filter((n) => catOf(n) === 'idea');
    db.buying = updatedNotes.filter((n) => catOf(n) === 'buying');
    db.routine = updatedNotes.filter((n) => catOf(n) === 'routine');
    db.goals = updatedNotes.filter((n) => catOf(n) === 'goals');
    db.guidance = updatedNotes.filter((n) => catOf(n) === 'guidance');

    await AsyncStorage.setItem('notesDB', JSON.stringify(db));
    setNotes(updatedNotes);
  };

  // ✅ delete selected
  const deleteSelected = async () => {
    const updated = notes.filter((n) => !selectedNotes.includes(n.id));
    setSelectedNotes([]);
    await updateDB(updated);
  };

  // ✅ pin selected
  const pinSelected = async () => {
    const updated = notes.map((n) =>
      selectedNotes.includes(n.id) ? { ...n, pin: true } : n,
    );
    setSelectedNotes([]);
    await updateDB(updated);
  };

  // ✅ mark as unfinished
  const unfinishedNote = async () => {
    const updated = notes.map((n) =>
      selectedNotes.includes(n.id) ? { ...n, finished: false } : n,
    );
    setSelectedNotes([]);
    await updateDB(updated);
  };

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
      default:
        return color || '#6B7280';
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
      {countedNotes === 0 ? (
        // Empty state
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
              fontFamily: 'InterBold',
              fontWeight: 'bold',
              fontSize: 35,
              textAlign: 'center',
            }}
          >
            No Finished Notes Yet
          </Text>
          <View style={{ width: 280 }}>
            <Text
              style={{
                fontFamily: 'InterRegular',
                fontSize: 15,
                fontWeight: '100',
                textAlign: 'center',
                marginTop: 10,
              }}
            >
              Once you create a note and finish it, it will appear on this
              screen. So, let&#39;s start your journey!
            </Text>
          </View>
          <View style={{ width: 200, alignItems: 'flex-end', paddingTop: 50 }}>
            <Image source={direction} />
          </View>
        </View>
      ) : (
        // Notes grid
        <View style={{ flex: 1, backgroundColor: '#FAF8FC' }}>
          {/* Header */}
          <View
            style={{
              height: 160,
              width: '100%',
              backgroundColor: '#6A3EA1',
              flexDirection: 'row',
            }}
          >
            <View
              style={{
                height: '100%',
                width: '50%',
                padding: 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  fontFamily: 'InterBold',
                  width: '100%',
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                Amazing Journey!
              </Text>
              <Text style={{ fontSize: 12, color: 'white' }}>
                You have successfully finished {countedNotes} notes
              </Text>
            </View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                width: '50%',
              }}
            >
              <Image source={sit} style={{ width: 160, height: 160 }} />
            </View>
          </View>

          {/* Notes grid list */}
          <FlatList
            data={finishedNotes}
            numColumns={2}
            contentContainerStyle={{
              gap: 10,
              padding: 10,
              paddingBottom: TAB_BAR_CLEARANCE,
            }}
            columnWrapperStyle={{ gap: 10 }}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => {
              const isSelected = selectedNotes.includes(item.id);

              return (
                <TouchableOpacity
                  onLongPress={() => toggleSelect(item.id)}
                  activeOpacity={0.8}
                  style={{ width: '48%' }}
                >
                  <View
                    style={{
                      backgroundColor:
                        item.backgroundColor ||
                        item.backgroudcolor ||
                        '#f5f5f5',
                      borderRadius: 10,
                      height: 252,
                      padding: 8,
                      overflow: 'hidden',
                      borderWidth: isSelected ? 3 : 0,
                      borderColor: isSelected ? '#6A3EA1' : 'transparent',
                      opacity: isSelected ? 0.7 : 1,
                    }}
                  >
                    <NoteCardPreview note={item} contentWidth={140} />

                    {/* Footer */}
                    <View
                      style={{
                        position: 'absolute',
                        backgroundColor:
                          item.backgroundColor ||
                          item.backgroudcolor ||
                          '#f5f5f5',
                        bottom: 0,
                        left: 0,
                        width: '110%',
                        height: 24,
                        justifyContent: 'center',
                        paddingHorizontal: 8,
                        paddingLeft: 20,
                      }}
                    >
                      <Text
                        style={{ color: 'white', fontSize: 12 }}
                        numberOfLines={1}
                      >
                        Finished Note
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />

          {/* Action Buttons */}
          {selectedNotes.length > 0 && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                padding: 10,
                backgroundColor: '#FAF8FC',
                position: 'absolute',
                width: '100%',
                bottom: ACTION_BAR_BOTTOM,
              }}
            >
              <TouchableOpacity onPress={unfinishedNote}>
                <Text style={{ color: 'green', fontSize: 20 }}>Unfinish</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={deleteSelected}>
                <Text style={{ color: 'red', fontSize: 20 }}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={pinSelected}>
                <Text style={{ color: '#6A3EA1', fontSize: 20 }}>Pin</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

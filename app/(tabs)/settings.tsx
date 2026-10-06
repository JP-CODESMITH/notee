import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { allNotes, loadDB } from '../../lib/notes';

export default function Settings() {
  const [username, setUsername] = useState('');
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    const name = await AsyncStorage.getItem('username');
    if (name) setUsername(name);
    const db = await loadDB();
    setCount(allNotes(db).length);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const clearNotes = () => {
    Alert.alert('Delete all notes?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.setItem(
            'notesDB',
            JSON.stringify({
              idea: [],
              buying: [],
              routine: [],
              goals: [],
              guidance: [],
            }),
          );
          setCount(0);
        },
      },
    ]);
  };

  const resetOnboarding = async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'false');
    router.replace('/onboarding');
  };

  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
      <View
        style={{
          height: 60,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 10,
          justifyContent: 'space-between',
          backgroundColor: 'white',
        }}
      >
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={{ flexDirection: 'row', alignItems: 'center' }}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color="#6A3EA1" />
          <Text
            style={{
              fontSize: 16,
              color: '#6A3EA1',
              marginLeft: 8,
              fontFamily: 'InterRegular',
            }}
          >
            Back
          </Text>
        </TouchableOpacity>
        <Text style={{ fontFamily: 'InterBold', fontSize: 17 }}>Settings</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={{ padding: 16 }}>
        <View
          style={{
            backgroundColor: '#F5F3FF',
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <Text style={{ fontFamily: 'InterBold', fontSize: 16 }}>
            {username ? `Hello, ${username}` : 'Hello'}
          </Text>
          <Text style={{ color: '#666', marginTop: 4 }}>
            {count} note{count === 1 ? '' : 's'} stored on this device
          </Text>
        </View>

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Replay onboarding"
          onPress={resetOnboarding}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 14,
            borderBottomWidth: 1,
            borderBottomColor: '#EEE',
          }}
        >
          <Text style={{ fontSize: 16 }}>Replay onboarding</Text>
          <Ionicons name="arrow-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Delete all notes"
          onPress={clearNotes}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 14,
          }}
        >
          <Text style={{ fontSize: 16, color: 'red' }}>Delete all notes</Text>
          <Ionicons name="trash-outline" size={20} color="red" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

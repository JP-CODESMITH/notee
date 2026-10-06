import Screen from '@/components/modal';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Checkbox, Divider } from 'react-native-paper';
import {
  actions,
  RichEditor,
  RichToolbar,
} from 'react-native-pell-rich-editor';
import { SafeAreaView } from 'react-native-safe-area-context';
import RoutineC from '../../components/routineC';
import type { ChecklistItem } from '../../lib/notes';
import {
  persistField as persistNoteField,
  persistRich as persistNoteRich,
  removeNote as removeNoteById,
} from '../../lib/notes';
//@ts-config
import ill from '../../assets/images/ill.png';
interface SubTodo {
  ids: string;
  subtext: string;
  checked: boolean;
}

interface Todo {
  id: number;
  text: string;
  checked: boolean;
  subTodo: SubTodo[]; // Array for multiple subtodos
}

export default function BuyScreen() {
  const router = useRouter();
  const [modal, setModal] = useState(false);
  const [modall, setModall] = useState(false);
  const [colourd, setColourd] = useState('white');
  const [colourds, setColourds] = useState('white');
  const [pinned, setPinned] = useState(false);
  const [title, setTitle] = useState('');
  const [input, setInput] = useState('');
  const [finish, setFinish] = useState(false);
  const { id, type } = useLocalSearchParams();
  const [note, setNote] = useState<any>(null);
  const [visiblel, setVisiblel] = useState(false);
  const buying = 'buying';
  const [todos, setTodos] = useState<ChecklistItem[]>([]);

  const [todo, setTodo] = useState<Todo[]>([]);
  
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [show, setShow] = useState(false);

  // Initialize with empty array

  const [mainTodoInput, setMainTodoInput] = useState('');
  const [subTodoInputs, setSubTodoInputs] = useState<{ [key: number]: string }>(
    {},
  );

  const addTodos = (text: string) => {
    if (!text.trim()) return;
    const updated = [
      ...todo,
      {
        id: Date.now(),
        text,
        checked: false,
        subTodo: [],
      },
    ];
    setTodo(updated);
    saveGoalsToStorage(updated);
    setMainTodoInput('');
  };

  const deleteGoal = (todoId: number) => {
    const updated = todo.filter((t) => t.id !== todoId);
    setTodo(updated);
    saveGoalsToStorage(updated);
  };

  const deleteSubTodo = (todoId: number, subId: string) => {
    const updated = todo.map((t) =>
      t.id === todoId
        ? { ...t, subTodo: t.subTodo.filter((s) => s.ids !== subId) }
        : t,
    );
    setTodo(updated);
    saveGoalsToStorage(updated);
  };

  const addSubTodo = (todoId: number, text: string) => {
    if (!text.trim()) return;
    const updated = todo.map((t) =>
      t.id === todoId
        ? {
            ...t,
            subTodo: [
              ...t.subTodo,
              {
                ids: Date.now().toString(),
                subtext: text,
                checked: false,
              },
            ],
          }
        : t,
    );
    setTodo(updated);
    saveGoalsToStorage(updated);
    setSubTodoInputs((prev) => ({ ...prev, [todoId]: '' }));
  };
  const richText = useRef<RichEditor | null>(null);
  const [image, setImage] = useState('');

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const dbString = await AsyncStorage.getItem('notesDB');
        const db = dbString ? JSON.parse(dbString) : {};

        const allNotes = [
          ...(db.idea || []),
          ...(db.buying || []),
          ...(db.routine || []),
          ...(db.goals || []),
          ...(db.guidance || []),
        ];
        const foundNote = allNotes.find(
          (n: any) => String(n.id) === String(id),
        );

        if (foundNote) {
          setNote(foundNote);
          setTitle(foundNote.title ?? '');
          setColourd(
            foundNote.backgroundColor ||
              foundNote.backgroundcolor ||
              foundNote.backgroudcolor ||
              '#FFFFFF',
          );
          setPinned(Boolean(foundNote.pin));
          setFinish(Boolean(foundNote.finished));
          setTodos(Array.isArray(foundNote.rich) ? foundNote.rich : []);
          setTodo(Array.isArray(foundNote.rich) ? foundNote.rich : []);
        }
      } catch (error) {
        console.error('Error loading note:', error);
      }
    };

    if (id) {
      fetchNote();
    }
  }, [id]);

  // ✅ NEW: Function to save updated todos back to AsyncStorage
  const updateTodoInStorage = async (
    updatedTodos: ChecklistItem[],
  ) => {
    try {
      const dbString = await AsyncStorage.getItem('notesDB');
      const db = dbString ? JSON.parse(dbString) : {};

      // Find which category the note belongs to
      const categories = ['idea', 'buying', 'routine', 'goals', 'guidance'];

      for (const category of categories) {
        if (db[category]) {
          const noteIndex = db[category].findIndex(
            (n: any) => String(n.id) === String(id),
          );

          if (noteIndex !== -1) {
            // Update the note's rich (todos) array
            db[category][noteIndex].rich = updatedTodos;

            // Save back to AsyncStorage
            await AsyncStorage.setItem('notesDB', JSON.stringify(db));
            break;
          }
        }
      }
    } catch (error) {
      console.error('Error saving todos:', error);
    }
  };
  const persistField = async (
    field: 'pin' | 'finished' | 'title' | 'image' | 'backgroundColor',
    value: string | boolean | null,
  ) => {
    const ok = await persistNoteField(id as string, field, value);
    if (ok) {
      setNote((prev: any) => (prev ? { ...prev, [field]: value } : prev));
    }
    return ok;
  };

  const persistRoutine = async (next: ChecklistItem[]) => {
    setTodos(next);
    await persistNoteRich(id as string, next);
  };

  const saveTitle = async (next: string) => {
    setTitle(next);
    await persistField('title', next);
  };

  const deleteCurrentNote = async () => {
    const ok = await removeNoteById(id as string);
    if (ok) {
      setModal(false);
      router.back();
    }
    return ok;
  };

  // Toggle checkbox and save to storage
  const toggleTodo = (todoId: number | string) => {
    const updatedTodos = todos.map((t) =>
      t.id === todoId ? { ...t, checked: !t.checked } : t,
    );

    setTodos(updatedTodos);
    updateTodoInStorage(updatedTodos); // Save to AsyncStorage
  };

  if (!note) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Note not found.</Text>
      </View>
    );
  }

  const addTodo = (text: string) => {
    if (!text.trim()) return;
    const updated = [...todos, { id: Date.now(), text, checked: false }];
    setTodos(updated);
    updateTodoInStorage(updated);
  };

  const deleteTodoItem = (todoId: number | string) => {
    const updated = todos.filter((t) => t.id !== todoId);
    setTodos(updated);
    updateTodoInStorage(updated);
  };
  const handleCustomAction = (action: string) => {
    switch (action) {
      case 'insertVideo':
        richText.current?.insertHTML(
          `<iframe width="100%" height="200" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>`,
        );
        break;
      case 'insertLine':
        richText.current?.insertHTML('<hr/>');
        break;
      case 'table':
        richText.current?.insertHTML(
          `<table border="1" style="width:100%; border-collapse: collapse;">
              <tr><th>Header 1</th><th>Header 2</th></tr>
              <tr><td>Row 1</td><td>Row 1</td></tr>
              <tr><td>Row 2</td><td>Row 2</td></tr>
            </table>`,
        );
        break;
      case 'setBackgroundColor':
        (richText.current as any)?.commandDOM('backColor', 'yellow');
        break;
      default:
        Alert.alert('Unsupported', `${action} not yet implemented`);
    }
  };
  const pickImage = async () => {
    // Request media library permissions on iOS and Android
    if (Platform.OS !== 'web') {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission required',
          'Please grant media library permissions to pick an image.',
        );
        return null; // Return null if permission denied
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'], // ✅ New format (not deprecated)
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      return result.assets[0].uri; // ✅ Return the URI
    }
    return null; // Return null if cancelled
  };

  const takePhoto = async (): Promise<string | undefined> => {
    // Request camera permissions on iOS and Android
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission required',
          'Please grant camera permissions to take a photo.',
        );
        return undefined;
      }
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      return uri;
    }
    return undefined;
  };
  const saveGoalsToStorage = async (updatedGoals: any) => {
    try {
      const dbString = await AsyncStorage.getItem('notesDB');
      const db = dbString ? JSON.parse(dbString) : {};

      const categories = ['goals']; // goals only

      const category = 'goals';
      if (db[category]) {
        const noteIndex = db[category].findIndex(
          (n: any) => String(n.id) === String(id),
        );

        if (noteIndex !== -1) {
          db[category][noteIndex].rich = updatedGoals;
          await AsyncStorage.setItem('notesDB', JSON.stringify(db));
        }
      }
    } catch (e) {
      console.error('Error saving goals:', e);
    }
  };


  const onchange = (_e: any, selectedDate?: Date) => {
    if (selectedDate) setDate(selectedDate);
    setShow(false);
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colourd }}>
      <StatusBar backgroundColor={colourd} />

      <View
        style={[
          styles.header,
          {
            backgroundColor: colourd,
            justifyContent: 'space-between',
          },
        ]}
      >
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center' }}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color={'#6A3EA1'} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <View>
          {String(type) === 'routine' ? (
            <>
              <TouchableOpacity
                style={{
                  width: 175,
                  height: '90%',
                  backgroundColor: '#6A3EA1',
                  padding: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  gap: 8,
                  borderRadius: 30,
                }}
                onPress={() => {
                  setVisiblel(true);
                }}
              >
                <Ionicons name="add" size={20} color={'white'} />
                <Text
                  style={{
                    fontFamily: 'InterRegular',
                    textAlign: 'center',
                    fontSize: 10,
                    fontWeight: 'bold',
                    color: 'white',
                  }}
                >
                  Add checkbox
                </Text>
              </TouchableOpacity>
            </>
          ) : null}
        </View>
      </View>

      {/* ✅ SIMPLIFIED: Removed FlatList, render directly */}
      <View style={{ flex: 1, backgroundColor: colourd, padding: 10 }}>
        <TextInput
          accessibilityLabel="Note title"
          style={{
            fontSize: 40,
            fontFamily: 'InterBold',
            fontWeight: 'bold',
            color: '#111',
          }}
          value={title}
          onChangeText={setTitle}
          onBlur={() => saveTitle(title)}
          onSubmitEditing={() => saveTitle(title)}
          placeholder="Untitled Note"
          returnKeyType="done"
        />
        {String(type) === 'buying' ? (
          <>
            {todos.map((todo) => (
              <View
                key={String(todo.id)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 10,
                }}
              >
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel={`Toggle ${todo.text}`}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1,
                  }}
                  onPress={() => toggleTodo(todo.id)}
                >
                  <Checkbox
                    status={todo.checked ? 'checked' : 'unchecked'}
                    color="#6A3EA1"
                  />
                  <Text
                    style={[
                      styles.todoText,
                      todo.checked && styles.todoChecked,
                    ]}
                  >
                    {todo.text}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel={`Delete ${todo.text}`}
                  onPress={() => deleteTodoItem(todo.id)}
                  style={{ padding: 8 }}
                >
                  <Ionicons name="trash-outline" size={20} color="#999" />
                </TouchableOpacity>
              </View>
            ))}

            <KeyboardAvoidingView>
              <TextInput
                placeholder="New item..."
                style={styles.newItemInput}
                value={input}
                onChangeText={setInput}
                onSubmitEditing={() => {
                  addTodo(input);
                  setInput('');
                }}
                returnKeyType="done"
              />
            </KeyboardAvoidingView>
            {/* Add button */}
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => {
                addTodo(input);
                setInput('');
              }}
            >
              <Ionicons name="add" size={20} color={'#6A3EA1'} />
              <Text style={styles.addBtnText}>Add checkbox</Text>
            </TouchableOpacity>
            <Divider style={{ marginVertical: 10 }} />
          </>
        ) : null}
        {String(type) === 'idea' ? (
          <View style={{ padding: 0 }}>
            <RichEditor
              ref={richText}
              style={[styles.editor, { backgroundColor: colourd }]}
              placeholder="Start writing..."
              initialContentHTML={note.rich} // 👈 prefill existing HTML
              initialHeight={300}
              onChange={async (html) => {
                try {
                  const dbString = await AsyncStorage.getItem('notesDB');
                  const db = dbString ? JSON.parse(dbString) : {};
                  const categories = [
                    'idea',
                    'buying',
                    'routine',
                    'goals',
                    'guidance',
                  ];

                  for (const category of categories) {
                    if (db[category]) {
                      const noteIndex = db[category].findIndex(
                        (n: any) => String(n.id) === String(id),
                      );
                      if (noteIndex !== -1) {
                        db[category][noteIndex].rich = html; // update the note’s rich text
                        await AsyncStorage.setItem(
                          'notesDB',
                          JSON.stringify(db),
                        );
                        break;
                      }
                    }
                  }
                } catch (error) {
                  console.error('Error saving note:', error);
                }
              }}
              // ✅ save html to state
              editorStyle={{
                backgroundColor: colourd,
                color: '#000',
                placeholderColor: '#999',
                contentCSSText: `padding: 15px; font-size: 16px; font-family: InterRegular;`,
              }}
            />
            <RichToolbar
              style={[styles.toolbar, { backgroundColor: colourd }]}
              editor={richText}
              selectedIconTint="#6A3EA1"
              disabledIconTint="#ccc"
              actions={[
                actions.setBold,
                actions.setItalic,
                actions.setUnderline,
                actions.insertBulletsList,
                actions.insertOrderedList,
                actions.insertImage,
                actions.insertLink,
                actions.alignCenter,
                actions.alignFull,
                actions.alignLeft,
                actions.alignRight,
                actions.heading1,
                actions.heading2,
                actions.heading3,
                actions.heading4,
                actions.heading5,
                actions.heading6,
                actions.setSubscript,
                actions.setSuperscript,
                actions.redo,
                actions.undo,
                actions.setStrikethrough,
                actions.insertText,
                'insertVideo',
                'table',
                'setBackgroundColor',
                'insertLine',
              ]}
              onPressAddImage={() =>
                richText.current?.insertImage('https://placekitten.com/300/200')
              }
              onPressAddLink={() =>
                richText.current?.insertLink('https://google.com', 'Google')
              }
              onPressAddFile={(action: string) => handleCustomAction(action)}
              iconMap={{
                [actions.heading1]: () => (
                  <Text style={{ fontSize: 14, fontFamily: 'InterBold' }}>
                    H1
                  </Text>
                ),
                [actions.heading2]: () => (
                  <Text style={{ fontSize: 14, fontFamily: 'InterBold' }}>
                    H2
                  </Text>
                ),
                [actions.heading3]: () => (
                  <Text style={{ fontSize: 14, fontFamily: 'InterBold' }}>
                    H3
                  </Text>
                ),
                [actions.heading4]: () => (
                  <Text style={{ fontSize: 14, fontFamily: 'InterBold' }}>
                    H4
                  </Text>
                ),
                [actions.heading5]: () => (
                  <Text style={{ fontSize: 14, fontFamily: 'InterBold' }}>
                    H5
                  </Text>
                ),
                [actions.heading6]: () => (
                  <Text style={{ fontSize: 14, fontFamily: 'InterBold' }}>
                    H6
                  </Text>
                ),
              }}
            />
          </View>
        ) : null}
        {String(type) === 'guidance' ? (
          <View style={{ padding: 0 }}>
            {note.image ? (
              <Image source={{ uri: note.image }} style={{ height: 200, width: '100%' }} />
            ) : null}
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={note.image ? 'Change cover image' : 'Add cover image'}
              style={styles.addBtn}
              onPress={async () => {
                const uri = await pickImage();
                if (uri) {
                  setImage(uri);
                  setNote((prev: any) => (prev ? { ...prev, image: uri } : prev));
                  await persistField('image', uri);
                }
              }}
            >
              <Ionicons name="image-outline" size={20} color="#6A3EA1" />
              <Text style={styles.addBtnText}>
                {note.image ? 'Change cover image' : 'Add cover image'}
              </Text>
            </TouchableOpacity>
            <RichEditor
              ref={richText}
              style={[styles.editor, { backgroundColor: colourd }]}
              placeholder="Start writing..."
              initialContentHTML={note.rich} // 👈 prefill existing HTML
              initialHeight={300}
              onChange={async (html) => {
                try {
                  const dbString = await AsyncStorage.getItem('notesDB');
                  const db = dbString ? JSON.parse(dbString) : {};
                  const categories = [
                    'idea',
                    'buying',
                    'routine',
                    'goals',
                    'guidance',
                  ];

                  for (const category of categories) {
                    if (db[category]) {
                      const noteIndex = db[category].findIndex(
                        (n: any) => String(n.id) === String(id),
                      );
                      if (noteIndex !== -1) {
                        db[category][noteIndex].rich = html; // update the note’s rich text
                        await AsyncStorage.setItem(
                          'notesDB',
                          JSON.stringify(db),
                        );
                        break;
                      }
                    }
                  }
                } catch (error) {
                  console.error('Error saving note:', error);
                }
              }}
              // ✅ save html to state
              editorStyle={{
                backgroundColor: colourd,
                color: '#000',
                placeholderColor: '#999',
                contentCSSText: `padding: 15px; font-size: 16px; font-family: InterRegular;`,
              }}
            />
            <RichToolbar
              style={[styles.toolbar, { backgroundColor: colourd }]}
              editor={richText}
              selectedIconTint="#6A3EA1"
              disabledIconTint="#ccc"
              actions={[
                actions.setBold,
                actions.setItalic,
                actions.setUnderline,
                actions.insertBulletsList,
                actions.insertOrderedList,
                actions.insertImage,
                actions.insertLink,
                actions.alignCenter,
                actions.alignFull,
                actions.alignLeft,
                actions.alignRight,
                actions.heading1,
                actions.heading2,
                actions.heading3,
                actions.heading4,
                actions.heading5,
                actions.heading6,
                actions.setSubscript,
                actions.setSuperscript,
                actions.redo,
                actions.undo,
                actions.setStrikethrough,
                actions.insertText,
                'insertVideo',
                'table',
                'setBackgroundColor',
                'insertLine',
              ]}
              onPressAddImage={() => {
                Alert.alert(
                  'Pick image',
                  'Do you want to pick an image from the device?',
                  [
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                    {
                      text: 'Camera',
                      onPress: async () => {
                        const imageUri = await takePhoto(); // ✅ Await the returned URI
                        if (imageUri) {
                          (richText.current as any)?.insertImage(
                            imageUri,
                            'width: 100%',
                          ); // ✅ Use the URI
                        }
                      },
                    },
                    {
                      text: 'Library',
                      onPress: async () => {
                        const imageUri = await pickImage(); // ✅ Await the returned URI
                        if (imageUri) {
                          (richText.current as any)?.insertImage(
                            imageUri,
                            'width: 100%',
                          ); // ✅ Use the URI
                        }
                      },
                    },
                  ],
                );
              }}
              onPressAddLink={() =>
                richText.current?.insertLink('https://google.com', 'Google')
              }
              onPressAddFile={(action: any) => handleCustomAction(action)}
              iconMap={{
                [actions.heading1]: () => (
                  <Text style={{ fontSize: 14, fontFamily: 'InterBold' }}>
                    H1
                  </Text>
                ),
                [actions.heading2]: () => (
                  <Text style={{ fontSize: 14, fontFamily: 'InterBold' }}>
                    H2
                  </Text>
                ),
                [actions.heading3]: () => (
                  <Text style={{ fontSize: 14, fontFamily: 'InterBold' }}>
                    H3
                  </Text>
                ),
                [actions.heading4]: () => (
                  <Text style={{ fontSize: 14, fontFamily: 'InterBold' }}>
                    H4
                  </Text>
                ),
                [actions.heading5]: () => (
                  <Text style={{ fontSize: 14, fontFamily: 'InterBold' }}>
                    H5
                  </Text>
                ),
                [actions.heading6]: () => (
                  <Text style={{ fontSize: 14, fontFamily: 'InterBold' }}>
                    H6
                  </Text>
                ),
              }}
            />
          </View>
        ) : null}
        {String(type) === 'routine' ? (
          <View style={{ backgroundColor: colourd, flex: 1 }}>
            <RoutineC
              visible={visiblel}
              setVisible={setVisiblel}
              todos={todos}
              setTodos={setTodos}
              title={note.title}
              onChange={(next) => persistNoteRich(id as string, next)}
            />
          </View>
        ) : null}
        {String(type) === 'goals' ? (
          <View style={{ backgroundColor: colourd, flex: 1, padding: 0 }}>
            {/* Show all todos */}
            {todo.map((goal) => (
              <View key={goal.id} style={{ marginBottom: 15 }}>
                {/* Main Todo */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 5,
                  }}
                >
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel={`Toggle ${goal.text}`}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      flex: 1,
                    }}
                    onPress={() => {
                      const updated = todo.map((t) =>
                        t.id === goal.id ? { ...t, checked: !t.checked } : t,
                      );
                      setTodo(updated);
                      saveGoalsToStorage(updated);
                    }}
                  >
                    <Checkbox
                      status={goal.checked ? 'checked' : 'unchecked'}
                      color="#6A3EA1"
                    />
                    <Text
                      style={[
                        styles.todoText,
                        goal.checked && styles.todoChecked,
                      ]}
                    >
                      {goal.text}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel={`Delete ${goal.text}`}
                    onPress={() => deleteGoal(goal.id)}
                    style={{ padding: 8 }}
                  >
                    <Ionicons name="trash-outline" size={20} color="#999" />
                  </TouchableOpacity>
                </View>

                {/* Sub Todos */}
                <View style={{ paddingLeft: 40 }}>
                  {goal.subTodo.map((sub) => (
                    <View
                      key={sub.ids}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 5,
                      }}
                    >
                      <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityLabel={`Toggle ${sub.subtext}`}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          flex: 1,
                        }}
                        onPress={() => {
                          const updated = todo.map((t) =>
                            t.id === goal.id
                              ? {
                                  ...t,
                                  subTodo: t.subTodo.map((s) =>
                                    s.ids === sub.ids
                                      ? { ...s, checked: !s.checked }
                                      : s,
                                  ),
                                }
                              : t,
                          );

                          setTodo(updated);
                          saveGoalsToStorage(updated);
                        }}
                      >
                        <Checkbox
                          status={sub.checked ? 'checked' : 'unchecked'}
                          color="#6A3EA1"
                        />
                        <Text
                          style={[
                            styles.todoText,
                            sub.checked && styles.todoChecked,
                          ]}
                        >
                          {sub.subtext}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityLabel={`Delete ${sub.subtext}`}
                        onPress={() => deleteSubTodo(goal.id, sub.ids)}
                        style={{ padding: 8 }}
                      >
                        <Ionicons name="trash-outline" size={18} color="#999" />
                      </TouchableOpacity>
                    </View>
                  ))}

                  {/* Add subtask input */}
                  <TextInput
                    placeholder="Add subtask..."
                    style={styles.newItemInput}
                    value={subTodoInputs[goal.id] || ''}
                    onChangeText={(text) =>
                      setSubTodoInputs((prev) => ({
                        ...prev,
                        [goal.id]: text,
                      }))
                    }
                    onSubmitEditing={() =>
                      addSubTodo(goal.id, subTodoInputs[goal.id] || '')
                    }
                    returnKeyType="done"
                  />
                  <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() =>
                      addSubTodo(goal.id, subTodoInputs[goal.id] || '')
                    }
                  >
                    <Ionicons name="add" size={20} color={'#6A3EA1'} />
                    <Text style={styles.addBtnText}>Add subtask</Text>
                  </TouchableOpacity>
                </View>
                <KeyboardAvoidingView>
                  <TextInput
                    placeholder="New item..."
                    style={styles.newItemInput}
                    value={input}
                    onChangeText={setInput}
                    onSubmitEditing={() => {
                      addTodos(input);
                      setInput('');
                    }}
                    returnKeyType="done"
                  />
                </KeyboardAvoidingView>
                {/* Add button */}
                <TouchableOpacity
                  style={styles.addBtn}
                  onPress={() => {
                    addTodos(input);
                    setInput('');
                  }}
                >
                  <Ionicons name="add" size={20} color={'#6A3EA1'} />
                  <Text style={styles.addBtnText}>Add checkbox</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : null}
      </View>

      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Text
            style={{
              fontSize: 12,
              color: 'black',
              width: '100%',
              fontFamily: 'InterRegular',
            }}
          >
            Last edited on 19:30
          </Text>
        </View>
        <View style={styles.footerRight}>
          <View style={[styles.box1, { backgroundColor: colourd }]}>
            <Ionicons name="search" size={24} />
          </View>
          <View style={[styles.box1, { backgroundColor: colourd }]}>
            <Ionicons name="bookmark-outline" size={24} />
          </View>
          <TouchableOpacity onPress={() => setModal(true)}>
            <View style={[styles.box]}>
              <Ionicons
                name="ellipsis-horizontal-outline"
                size={24}
                color={'white'}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <Screen visible={modal} svisible={setModal} colour={colourd}>
        <>
          <TouchableOpacity onPress={() => setModal(false)}>
            <Ionicons
              name="close-circle"
              size={24}
              color={'#827D89'}
              style={{ textAlign: 'right' }}
            ></Ionicons>
          </TouchableOpacity>
          <Text style={{ fontSize: 14, fontWeight: '600' }}>
            Change Background
          </Text>
          <FlatList
            data={[
              { id: 1, colour: '#C8C5CB' },
              { id: 2, colour: '#F7DEE3' },
              { id: 3, colour: '#EFE9F7' },
              { id: 4, colour: '#DAF6E4' },
              { id: 5, colour: '#FDEBAB' },
              { id: 6, colour: '#F7F6D4' },
              { id: 7, colour: '#EFEEF0' },
            ]}
            horizontal
            scrollEnabled={false}
            style={{ maxHeight: 60 }}
            contentContainerStyle={{
              justifyContent: 'space-between',
              marginLeft: 5,
              maxHeight: 20,
            }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  margin: 5,
                  borderColor: 'white',
                  borderWidth: 2,
                  backgroundColor: item.colour,
                }}
                onPress={async (colour) => {
                  try {
                    const dbString = await AsyncStorage.getItem('notesDB');
                    const db = dbString ? JSON.parse(dbString) : {};
                    const categories = [
                      'idea',
                      'buying',
                      'routine',
                      'goals',
                      'guidance',
                    ];

                    for (const category of categories) {
                      if (db[category]) {
                        const noteIndex = db[category].findIndex(
                          (n: any) => String(n.id) === String(id),
                        );
                        if (noteIndex !== -1) {
                          db[category][noteIndex].backgroundcolor = item.colour; // update the note’s rich text
                          await AsyncStorage.setItem(
                            'notesDB',
                            JSON.stringify(db),
                          );
                          setColourd(item.colour);
                          break;
                        }
                      }
                    }
                  } catch (error) {
                    console.error('Error saving note:', error);
                  }
                }}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        </>
        <Divider style={{ height: 2, borderRadius: 20 }} />
        <>
          <Text style={{ fontSize: 17, fontWeight: '600', marginTop: 5 }}>
            extras
          </Text>
          <TouchableOpacity>
            <View
              style={{
                height: 56,
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons
                  name="alarm-outline"
                  size={24}
                  style={{ marginRight: 5 }}
                />
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                  Set Reminder
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                  Not set
                </Text>
                <Ionicons name="arrow-forward" size={24} />
              </View>
            </View>
          </TouchableOpacity>
          {show && (
            <DateTimePicker
              mode="date"
              value={date ?? new Date()}
              onChange={onchange}
            />
          )}
          <TouchableOpacity>
            <View
              style={{
                height: 56,
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons
                  name={'create-outline'}
                  size={24}
                  style={{ marginRight: 5 }}
                />
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                  Change Note Type
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                  Buying Some...
                </Text>
                <Ionicons name="arrow-forward" size={24} />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View
              style={{
                height: 56,
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons
                  name="pricetag-outline"
                  size={24}
                  style={{ marginRight: 5 }}
                />
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                  Give Label
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                  Not set
                </Text>
                <Ionicons name="arrow-forward" size={24} />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Pin the note"
            onPress={async () => {
              const next = !pinned;
              setPinned(next);
              await persistField('pin', next);
              setModall(true);
            }}
          >
            <View
              style={{
                height: 56,
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Ionicons
                  name="pin-outline"
                  size={24}
                  style={{ marginRight: 5 }}
                />
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                  Pin the note
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Mark as finished"
            onPress={async () => {
              const next = !finish;
              setFinish(next);
              await persistField('finished', next);
              setModal(false);
            }}
          >
            <View
              style={{
                height: 56,
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Ionicons
                  name="checkmark-done-outline"
                  size={24}
                  style={{ marginRight: 5 }}
                />
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                  Mark as Finished
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </>
        <Divider />
        <>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Delete note"
            onPress={() => {
              Alert.alert('Delete note?', 'This cannot be undone.', [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: () => deleteCurrentNote(),
                },
              ]);
            }}
          >
            <View
              style={{
                height: 56,
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Ionicons
                  name="trash-outline"
                  size={30}
                  color={'red'}
                  style={{ marginRight: 5 }}
                />
                <Text
                  style={{
                    fontFamily: 'inter-regular',
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: 'red',
                  }}
                >
                  Delete Note
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </>
      </Screen>
      <Screen visible={modall} svisible={setModall} colour={colourd}>
        <View
          style={{
            height: '100%',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 20,
          }}
        >
          <Image source={ill} style={{ width: 160, height: 160 }} />
          <View style={{ alignItems: 'center' }}>
            <>
              <Text
                style={{
                  fontFamily: 'interBold',
                  fontSize: 20,
                  fontWeight: 'bold',
                }}
              >
                Notes Pinned Successfully
              </Text>
            </>
            <>
              <Text
                style={{
                  fontFamily: 'interRegular',
                  fontSize: 16,
                  textAlign: 'center',
                  width: 280,
                }}
              >
                This note already displayed on pinned section
              </Text>
            </>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: '#6A3EA1',
              padding: 15,
              borderRadius: 40,
              paddingHorizontal: 30,
            }}
            onPress={() => {
              setModall(false);
            }}
          >
            <Text style={{ fontSize: 16, color: 'white' }}>close</Text>
          </TouchableOpacity>
        </View>
      </Screen>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ui: {
    flex: 1,
    width: '95%',
  },
  header: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
    shadowColor: 'black',
    paddingHorizontal: 10,
  },
  backText: {
    fontSize: 16,
    color: '#6A3EA1',
    marginLeft: 8,
    fontFamily: 'InterRegular',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    paddingBottom: 20,
    fontFamily: 'InterBold',
  },
  titleInput: {
    fontSize: 40,
    fontFamily: 'InterBold',
  },
  todoText: {
    marginLeft: 10,
    fontSize: 18,
    color: 'black',
    fontFamily: 'InterRegular',
  },
  todoChecked: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  newItemInput: {
    borderBottomWidth: 1,
    padding: 5,
    fontSize: 18,
    fontFamily: 'InterRegular',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 15,
  },
  addBtnText: {
    fontSize: 19,
    color: '#6A3EA1',
    marginLeft: 5,
    fontFamily: 'InterRegular',
  },
  box: {
    width: 60,
    height: '100%',
    backgroundColor: '#6A3EA1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box1: {
    width: 60,
    height: '100%',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: { backgroundColor: 'white' },
  footer: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowOpacity: 0.25,
    shadowRadius: 1,
    elevation: 0.5,
    shadowColor: 'black',
  },
  footerLeft: {
    width: '55.5555556%',
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  footerRight: {
    flexDirection: 'row',
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '44.44444444%',
  },
  footerText: {
    fontSize: 12,
    color: 'black',
    fontFamily: 'InterRegular',
  },
  editor: {
    borderRadius: 12,
    fontSize: 16,
    fontFamily: 'InterRegular',
    minHeight: 300,
  },
  toolbar: {
    borderRadius: 12,
    marginVertical: 10,
    paddingHorizontal: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    minWidth: '100%',
  },
  rich: {},
});

import Screen from '@/components/modal';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Checkbox, Divider } from 'react-native-paper'; // ✅ Paper Checkbox
import { SafeAreaView } from 'react-native-safe-area-context';

import AsyncStorage from '@react-native-async-storage/async-storage';
import ill from '../assets/images/ill.png';

export default function GoalsScreen() {
  const router = useRouter();
  const [modal, setModal] = useState(false);
  const [modall, setModall] = useState(false);
  const [colourd, setColourd] = useState('white');
  const [pinned, setPinned] = useState(false);
  const [title, setTitle] = useState('');
  const [input, setInput] = useState('');
  const [finish, setFinish] = useState(false);
  const colours = [
    { id: 1, colour: '#C8C5CB' },
    { id: 2, colour: '#F7DEE3' },
    { id: 3, colour: '#EFE9F7' },
    { id: 4, colour: '#DAF6E4' },
    { id: 5, colour: '#FDEBAB' },
    { id: 6, colour: '#F7F6D4' },
    { id: 7, colour: '#EFEEF0' },
  ];

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

  const [todos, setTodos] = useState<Todo[]>([]);

  // Initialize with empty array

  const [mainTodoInput, setMainTodoInput] = useState('');
  const [subTodoInputs, setSubTodoInputs] = useState<{ [key: number]: string }>(
    {},
  );

  const addTodo = (text: string) => {
    if (!text.trim()) return;
    setTodos([
      ...todos,
      {
        id: Date.now(),
        text,
        checked: false,
        subTodo: [],
      },
    ]);
    setMainTodoInput('');
  };

  const addSubTodo = (todoId: number, text: string) => {
    if (!text.trim()) return;
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === todoId
          ? {
              ...todo,
              subTodo: [
                ...todo.subTodo,
                {
                  ids: Date.now().toString(),
                  subtext: text,
                  checked: false,
                },
              ],
            }
          : todo,
      ),
    );
    setSubTodoInputs((prev) => ({ ...prev, [todoId]: '' }));
  };
  const saveNote = async () => {
    try {
      const dbString = await AsyncStorage.getItem('notesDB');
      let db = dbString
        ? JSON.parse(dbString)
        : { idea: [], guidance: [], goals: [], routine: [], buying: [] };
      if (!db.goals) {
        db.goals = [];
      }

      console.log(todos);

      const newNote = {
        id: Date.now(),
        title,
        rich: todos, // ✅ prefer editor's content
        pin: pinned,
        finished: finish || false,
        backgroudcolor: colourd || '#ffffff',
        type: 'goals',
      };
      db.goals.push(newNote);
      await AsyncStorage.setItem('notesDB', JSON.stringify(db));

      console.log('Note saved:', newNote); // ✅ Debug log
      Alert.alert('Saved', 'Your todo list has been saved!');
      router.back();
    } catch (error) {
      console.log('Error saving note:', error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colourd }}>
      <StatusBar />
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: colourd, justifyContent: 'space-between' },
        ]}
      >
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center' }}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color={'#6A3EA1'} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        {!title ? null : (
          <View
            style={{
              backgroundColor: '#6A3EA1',
              padding: 10,
              borderRadius: 90,
            }}
          >
            <TouchableOpacity onPress={saveNote}>
              <Ionicons name="save-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </View>
      {/* Content */}
      <View style={styles.ui}>
        <KeyboardAvoidingView>
          <ScrollView style={{ paddingTop: 20, paddingLeft: 15 }}>
            <View style={{ marginBottom: 300 }}>
              {!title ? (
                // Input for Todo Title
                <TextInput
                  placeholder="Enter your Todo Title"
                  style={[styles.titleInput]}
                  value={input}
                  onChangeText={setInput}
                  maxLength={40}
                  onSubmitEditing={() => {
                    setTitle(input);
                    setInput('');
                  }}
                  returnKeyType="done"
                />
              ) : (
                <>
                  <Text style={styles.title}>{title}</Text>

                  {/* Show all todos */}
                  {todos.map((todo) => (
                    <View key={todo.id} style={{ marginBottom: 15 }}>
                      {/* Main Todo */}
                      <TouchableOpacity
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginBottom: 5,
                        }}
                        onPress={() =>
                          setTodos((prev) =>
                            prev.map((t) =>
                              t.id === todo.id
                                ? { ...t, checked: !t.checked }
                                : t,
                            ),
                          )
                        }
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

                      {/* Sub Todos */}
                      <View style={{ paddingLeft: 40 }}>
                        {todo.subTodo.map((sub) => (
                          <TouchableOpacity
                            key={sub.ids}
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginBottom: 5,
                            }}
                            onPress={() =>
                              setTodos((prev) =>
                                prev.map((t) =>
                                  t.id === todo.id
                                    ? {
                                        ...t,
                                        subTodo: t.subTodo.map((s) =>
                                          s.ids === sub.ids
                                            ? { ...s, checked: !s.checked }
                                            : s,
                                        ),
                                      }
                                    : t,
                                ),
                              )
                            }
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
                        ))}

                        {/* Add subtask input */}
                        <TextInput
                          placeholder="Add subtask..."
                          style={styles.newItemInput}
                          value={subTodoInputs[todo.id] || ''}
                          onChangeText={(text) =>
                            setSubTodoInputs((prev) => ({
                              ...prev,
                              [todo.id]: text,
                            }))
                          }
                          onSubmitEditing={() =>
                            addSubTodo(todo.id, subTodoInputs[todo.id] || '')
                          }
                          returnKeyType="done"
                        />
                        <TouchableOpacity
                          style={styles.addBtn}
                          onPress={() =>
                            addSubTodo(todo.id, subTodoInputs[todo.id] || '')
                          }
                        >
                          <Ionicons name="add" size={20} color={'#6A3EA1'} />
                          <Text style={styles.addBtnText}>Add subtask</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}

                  {/* Input to add new checkbox item */}
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
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
      {/* Info & actions */}
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
            Last edited : just now
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
            data={colours}
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
                  backgroundColor: item.colour, // ✅ correct property
                }}
                onPress={() => setColourd(item.colour)}
              />
            )}
            keyExtractor={(item) => item.id.toString()} // ✅ call toString()
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
            onPress={() => {
              setPinned(true);
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
            onPress={() => {
              setFinish(false);
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
          <TouchableOpacity>
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

export const styles = StyleSheet.create({
  ui: {
    flex: 1,
    width: '95%',
  },
  header: {
    height: 60,
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
    fontWeight: 'bold',
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
});

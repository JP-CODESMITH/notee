import Screen from '@/components/modal';
import { Ionicons, Entypo, FontAwesome } from '@expo/vector-icons';
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
  Modal,
} from 'react-native';
import { Checkbox, Divider } from 'react-native-paper'; // ✅ Paper Checkbox
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ill from '../assets/images/ill.png';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
export default function BuyScreen() {
  const router = useRouter();
  const [modal, setModal] = useState(false);
  const [modall, setModall] = useState(false);
  const [visiblel, setVisiblel] = useState(false);
  const [colourd, setColourd] = useState('white');
  const [colourk, setColourk] = useState('white');
  const [colourt, setColourt] = useState('black');
  const [pinned, setPinned] = useState(false);
  const [title, setTitle] = useState('');
  const [inputT, setInputT] = useState('');
  const [input, setInput] = useState('');
  const [finish, setFinish] = useState(false);
  const colourr: { id: number; colour: string }[] = [
    { id: 1, colour: '#C8C5CB' },
    { id: 2, colour: '#F7DEE3' },
    { id: 3, colour: '#EFE9F7' },
    { id: 4, colour: '#DAF6E4' },
    { id: 5, colour: '#FDEBAB' },
    { id: 6, colour: '#F7F6D4' },
    { id: 7, colour: '#EFEEF0' },
  ];
  const colour = [
    { id: 1, colour: '#F7F6D4', text: '#565510' },
    { id: 2, colour: '#EFE9F7', text: "#6A3EA1'" },
    { id: 3, colour: '#DAF6E4', text: '#1F7F40' },
    { id: 4, colour: '#FDEBAB', text: '#725A03' },
  ];
  const [todos, setTodos] = useState<
    {
      id: number;
      title?: string;
      text: string;
      colourT: string;
      colourK: string;
      checked: boolean;
      complete?: boolean;
    }[]
  >([]);
  const deleteTodo = (id: number) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const addTodo = (
    title: string,
    text: string,
    colourT: string,
    colourK: string,
  ) => {
    if (!text.trim()) return;
    setTodos([
      ...todos,
      {
        id: Date.now(),
        title,
        text,
        colourT,
        colourK,
        complete: false,
        checked: false,
      },
    ]);
  };
  const saveNote = async () => {
    try {
      const dbString = await AsyncStorage.getItem('notesDB');
      let db = dbString
        ? JSON.parse(dbString)
        : { idea: [], guidance: [], goals: [], routine: [], buying: [] };
      if (!db.routine) {
        db.routine = [];
      }

      const newNote = {
        id: Date.now(),
        title,
        rich: todos, // ✅ prefer editor's content
        pin: pinned,
        type: 'routine',
        finished: finish || false,
        backgroudcolor: colourd || '#ffffff',
      };
      db.routine.push(newNote);
      await AsyncStorage.setItem('notesDB', JSON.stringify(db));

      Alert.alert('Saved', 'Your todo list has been saved!');
      router.back();
    } catch (error) {
      console.log('Error saving note:', error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colourd }}>
      <StatusBar backgroundColor="white" />
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: colourd, justifyContent: 'space-between' },
        ]}
      >
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center' }}
          onPress={() => {
            Alert.alert('Exit', 'do you want save', [
              {
                text: 'Discard',
                onPress: () => {
                  console.log('didnt save routine');
                  router.back();
                },
              },
              {
                text: 'Cancel',
                onPress: () => {
                  console.log('didnt save routine');
                },
                style: 'cancel',
              },
              {
                text: 'YES',
                onPress: () => {
                  console.log('OK Pressed');
                  saveNote();
                  router.back();
                },
              },
            ]);
          }}
        >
          <Ionicons name="arrow-back" size={20} color={'#6A3EA1'} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        {!title ? null : (
          <TouchableOpacity
            style={{
              width: 175,
              height: '90%',
              backgroundColor: '#6A3EA1',
              padding: 16,
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
                fontSize: 16,
                fontWeight: 'medium',
                color: 'white',
              }}
            >
              Add checkbox
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {/* Content */}
      <View style={styles.ui}>
        <ScrollView
          style={{ paddingTop: 20, paddingLeft: 15, paddingBottom: 400 }}
        >
          {!title ? (
            // Input for Todo Title
            <TextInput
              placeholder="Enter your Todo Title"
              style={[styles.titleInput]}
              value={input}
              numberOfLines={2}
              focusable
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
              {todos
                .filter((todo) => !todo.checked)
                .map((todo) => (
                  <View
                    key={todo.id}
                    style={{
                      width: '95%',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      gap: 10,
                      marginLeft: 15,
                    }}
                  >
                    <FontAwesome name="navicon" size={24} color="black" />
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 10,
                        width: 300,
                        height: 124,
                        padding: 10,
                        borderRadius: 15,

                        backgroundColor: todo.colourK,
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
                      <View style={{ flexDirection: 'column', width: '100%' }}>
                        <View style={{ height: 36, width: '100%' }}>
                          <BouncyCheckbox
                            size={25}
                            fillColor={todo.colourT}
                            unFillColor={todo.colourK}
                            isChecked={todo.checked}
                            text={todo.title}
                            iconStyle={{ borderColor: todo.colourT }} // ✅ border color
                            innerIconStyle={{ borderWidth: 2 }}
                            textStyle={[
                              styles.todoText,
                              todo.checked && styles.todoChecked,
                              {
                                color: todo.colourT, // ✅ fixed property name
                                textDecorationLine: todo.checked
                                  ? 'line-through'
                                  : 'none',
                              },
                            ]}
                            onPress={(isChecked: boolean) => {
                              setTodos((prev) =>
                                prev.map((t) =>
                                  t.id === todo.id
                                    ? {
                                        ...t,
                                        checked: isChecked,
                                        complete: isChecked,
                                      }
                                    : t,
                                ),
                              );
                              console.log(todo.complete);
                            }}
                          />
                        </View>
                        <Divider
                          style={{ height: 2, borderRadius: 20, width: '100%' }}
                        />
                        <View style={{ flex: 1, height: 72 }}>
                          <Text
                            style={[
                              {
                                fontSize: 14,
                                fontFamily: 'InterRegular',
                                fontWeight: 400,
                              },
                              todo.checked && styles.todoChecked,
                              {
                                color: todo.colourT, // ✅ fixed property name
                                textDecorationLine: todo.checked
                                  ? 'line-through'
                                  : 'none',
                              },
                            ]}
                          >
                            {todo.text}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteTodo(todo.id)}>
                      <Entypo
                        name="circle-with-cross"
                        size={24}
                        color="black"
                      />
                    </TouchableOpacity>
                  </View>
                ))}

              {/* Input to add new checkbox item */}
              <Modal
                visible={visiblel}
                transparent
                animationType="slide"
                onRequestClose={() => setVisiblel(false)}
              >
                <View
                  style={{
                    flex: 1,
                    height: '100%',
                    backgroundColor: '#00000010',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <View
                    style={{
                      backgroundColor: colourk,
                      height: 350,
                      width: '90%',
                      borderRadius: 10,
                      padding: 10,

                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: 5,
                    }}
                  >
                    <TextInput
                      placeholder="Title"
                      style={{
                        width: '90%',
                        fontSize: 20,
                        fontFamily: 'InterRegular',
                        fontWeight: 'bold',
                        color: colourt,
                        borderWidth: 1,
                        borderRadius: 5,
                        borderColor: colourt,
                        backgroundColor: colourk,
                      }}
                      numberOfLines={3}
                      onChangeText={setInputT}
                      returnKeyType="done"
                    />
                    <TextInput
                      placeholder="New Routine..."
                      style={{
                        height: '50%',
                        width: '90%',
                        fontFamily: 'InterRegular',
                        fontSize: 20,
                        color: colourt,
                        textAlign: 'left',
                        borderWidth: 1,
                        borderRadius: 5,
                        borderColor: colourt,
                        backgroundColor: colourk,
                      }}
                      numberOfLines={3}
                      onChangeText={setInput}
                      returnKeyType="done"
                    />

                    <FlatList
                      data={colour}
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
                          onPress={() => {
                            setColourk(item.colour);
                            setColourt(item.text);
                          }}
                        />
                      )}
                      keyExtractor={(item) => item.id.toString()} // ✅ call toString()
                    />
                    <TouchableOpacity
                      onPress={() => {
                        if (!input && !inputT) {
                          Alert.alert(
                            'Text field error',
                            'check your Title or Routine, either is empty',
                            [
                              {
                                text: 'Cancel',
                                onPress: () => console.log('Cancel Pressed'),
                                style: 'cancel',
                              },
                              {
                                text: 'OK',
                                onPress: () => console.log('OK Pressed'),
                              },
                            ],
                          );
                        } else {
                          addTodo(inputT, input, colourt, colourk);
                          setInput('');
                          setInputT('');
                          setColourt('black');
                          setColourk('white');
                          setVisiblel(false);
                        }
                      }}
                      style={{
                        width: 150,
                        backgroundColor: colourt,
                        height: 40,
                        borderWidth: 1,
                        borderRadius: 30,
                        borderColor: 'white',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 20,
                          fontFamily: 'InterBold',
                          textAlign: 'center',
                          color: colourk,
                        }}
                      >
                        Submit
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

              {/* Add button */}
              <Divider style={{ marginVertical: 10 }} />
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: 'InterRegular',
                  color: '#837d89',
                  paddingVertical: 10,
                }}
              >
                COMPLETED SUB NOTES
              </Text>
              {todos
                .filter((todo) => todo.checked)
                .map((todo) => (
                  <View
                    key={todo.id}
                    style={{
                      width: '95%',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      gap: 10,
                      marginLeft: 15,
                    }}
                  >
                    <FontAwesome name="navicon" size={24} color="black" />
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 10,
                        width: 300,
                        height: 124,
                        padding: 10,
                        borderRadius: 15,

                        backgroundColor: todo.colourK,
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
                      <View style={{ flexDirection: 'column', width: '100%' }}>
                        <View style={{ height: 36, width: '100%' }}>
                          <BouncyCheckbox
                            size={25}
                            fillColor={todo.colourT}
                            unFillColor={todo.colourK}
                            isChecked={todo.checked}
                            text={todo.title}
                            iconStyle={{ borderColor: todo.colourT }} // ✅ border color
                            innerIconStyle={{ borderWidth: 2 }}
                            textStyle={[
                              styles.todoText,
                              todo.checked && styles.todoChecked,
                              {
                                color: todo.colourT, // ✅ fixed property name
                                textDecorationLine: todo.checked
                                  ? 'line-through'
                                  : 'none',
                              },
                            ]}
                            onPress={(isChecked: boolean) => {
                              setTodos((prev) =>
                                prev.map((t) =>
                                  t.id === todo.id
                                    ? {
                                        ...t,
                                        checked: isChecked,
                                        complete: isChecked,
                                      }
                                    : t,
                                ),
                              );
                              console.log(todo.complete);
                            }}
                          />
                        </View>
                        <Divider
                          style={{ height: 2, borderRadius: 20, width: '100%' }}
                        />
                        <View style={{ flex: 1, height: 72 }}>
                          <Text
                            style={[
                              {
                                fontSize: 14,
                                fontFamily: 'InterRegular',
                                fontWeight: 400,
                              },
                              todo.checked && styles.todoChecked,
                              {
                                color: todo.colourT, // ✅ fixed property name
                                textDecorationLine: todo.checked
                                  ? 'line-through'
                                  : 'none',
                              },
                            ]}
                          >
                            {todo.text}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteTodo(todo.id)}>
                      <Entypo
                        name="circle-with-cross"
                        size={24}
                        color="black"
                      />
                    </TouchableOpacity>
                  </View>
                ))}
            </>
          )}
        </ScrollView>
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
      <Screen visible={modal} svisible={setModal} color={colourd}>
        <View style={{ flex: 1 }}>
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
            <View style={{ height: 20 }}>
              <Text>hello</Text>
            </View>
            <FlatList
              data={colourr}
              horizontal
              scrollEnabled={false}
              contentContainerStyle={{
                justifyContent: 'space-between',
                marginLeft: 5,
                maxHeight: 20,
                height: 20
              }}
              refreshing={false}
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
        </View>
      </Screen>
      <Screen visible={modall} svisible={setModall} colour={colourd}>
        <View>
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
    height: 60,
    paddingTop: 0,
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowOpacity: 0.25,
    shadowRadius: 1,
    elevation: 0.5,
    shadowColor: "black",
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

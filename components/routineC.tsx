import { Entypo, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { Divider } from 'react-native-paper'; // ✅ Paper Checkbox
import { SafeAreaView } from 'react-native-safe-area-context';
export default function RoutineC({ visible, setVisible, todos }) {
  const router = useRouter();
  const [modal, setModal] = useState(false);
  const [modall, setModall] = useState(false);
  const [colourd, setColourd] = useState('white');
  const [colourk, setColourk] = useState('white');
  const [colourt, setColourt] = useState('black');
  const [pinned, setPinned] = useState(false);
  const [title, setTitle] = useState('');
  const [inputT, setInputT] = useState('');
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
  const colour = [
    { id: 1, colour: '#F7F6D4', text: '#565510' },
    { id: 2, colour: '#EFE9F7', text: "#6A3EA1'" },
    { id: 3, colour: '#DAF6E4', text: '#1F7F40' },
    { id: 4, colour: '#FDEBAB', text: '#725A03' },
  ];
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colourd }}>
      <StatusBar backgroundColor="white" />
      {/* Header */}

      {/* Content */}
      <View style={styles.ui}>
        <ScrollView
          style={{ paddingTop: 20, paddingLeft: 15, paddingBottom: 400 }}
        >
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
                          t.id === todo.id ? { ...t, checked: !t.checked } : t,
                        ),
                      )
                    }
                  >
                    <View style={{ flexDirection: 'column', width: '100%' }}>
                      <View style={{ height: 36, width: '100%' }}>
                        <BouncyCheckbox
                          size={25}
                          fillColor={todo.colourT} // ✅ text color
                          unfillColor={todo.colourK} // ✅ background color
                          status={todo.checked ? 'checked' : 'unchecked'}
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
                    <Entypo name="circle-with-cross" size={24} color="black" />
                  </TouchableOpacity>
                </View>
              ))}

            {/* Input to add new checkbox item */}
            <Modal
              visible={visible}
              transparent
              animationType="slide"
              onRequestClose={() => setVisible(false)}
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
                      textAlign: 'left',
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
                fontfamily: 'InterRegular',
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
                          t.id === todo.id ? { ...t, checked: !t.checked } : t,
                        ),
                      )
                    }
                  >
                    <View style={{ flexDirection: 'column', width: '100%' }}>
                      <View style={{ height: 36, width: '100%' }}>
                        <BouncyCheckbox
                          size={25}
                          fillColor={todo.colourT} // ✅ text color
                          unfillColor={todo.colourK} // ✅ background color
                          status={todo.checked ? 'checked' : 'unchecked'}
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
                    <Entypo name="circle-with-cross" size={24} color="black" />
                  </TouchableOpacity>
                </View>
              ))}
          </>
        </ScrollView>
      </View>
      {/* Info & actions */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ui: {
    flex: 1,
    width: '95%',
  },
  header: {
    height: 60 + StatusBar.currentHeight,
    paddingTop: StatusBar.currentHeight,
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

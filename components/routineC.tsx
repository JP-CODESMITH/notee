import { Entypo, FontAwesome } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
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
import { Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ChecklistItem } from '../lib/notes';

interface RoutineCProps {
  visible: boolean;
  setVisible: (v: boolean) => void;
  todos: ChecklistItem[];
  setTodos: React.Dispatch<React.SetStateAction<ChecklistItem[]>>;
  title?: string;
  onChange?: (next: ChecklistItem[]) => void;
}

export default function RoutineC({ visible, setVisible, todos, setTodos, title = '', onChange }: RoutineCProps) {
  const [colourk, setColourk] = useState('white');
  const [colourt, setColourt] = useState('black');
  const [inputT, setInputT] = useState('');
  const [input, setInput] = useState('');

  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    onChange?.(todos);
  }, [todos]);

  const colour = [
    { id: 1, colour: '#F7F6D4', text: '#565510' },
    { id: 2, colour: '#EFE9F7', text: '#6A3EA1' },
    { id: 3, colour: '#DAF6E4', text: '#1F7F40' },
    { id: 4, colour: '#FDEBAB', text: '#725A03' },
  ];

  const addTodo = (todoTitle: string, text: string, colourT: string, colourK: string) => {
    if (!text.trim()) return;
    setTodos((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: todoTitle,
        text,
        colourT,
        colourK,
        complete: false,
        checked: false,
      },
    ]);
  };

  const deleteTodo = (id: number | string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTodo = (id: number | string, checked?: boolean) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, checked: checked ?? !t.checked, complete: checked ?? !t.checked }
          : t,
      ),
    );
  };

  const renderTodoCard = (todo: ChecklistItem) => (
    <View
      key={String(todo.id)}
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
        accessibilityRole="button"
        accessibilityLabel={`Toggle ${todo.title || 'routine item'}`}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 10,
          width: 300,
          height: 124,
          padding: 10,
          borderRadius: 15,
          backgroundColor: todo.colourK ?? '#fff',
        }}
        onPress={() => toggleTodo(todo.id)}
      >
        <View style={{ flexDirection: 'column', width: '100%' }}>
          <View style={{ height: 36, width: '100%' }}>
            <BouncyCheckbox
              size={25}
              fillColor={todo.colourT ?? '#6A3EA1'}
              unFillColor={todo.colourK ?? '#fff'}
              isChecked={Boolean(todo.checked)}
              text={todo.title ?? ''}
              iconStyle={{ borderColor: todo.colourT ?? '#6A3EA1' }}
              innerIconStyle={{ borderWidth: 2 }}
              textStyle={[
                styles.todoText,
                todo.checked && styles.todoChecked,
                {
                  color: todo.colourT ?? '#000',
                  textDecorationLine: todo.checked ? 'line-through' : 'none',
                },
              ]}
              onPress={(isChecked: boolean) => toggleTodo(todo.id, isChecked)}
            />
          </View>
          <Divider style={{ height: 2, borderRadius: 20, width: '100%' }} />
          <View style={{ flex: 1, height: 72 }}>
            <Text
              style={[
                {
                  fontSize: 14,
                  fontFamily: 'InterRegular',
                  fontWeight: '400',
                },
                todo.checked && styles.todoChecked,
                {
                  color: todo.colourT ?? '#000',
                  textDecorationLine: todo.checked ? 'line-through' : 'none',
                },
              ]}
            >
              {todo.text}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={`Delete ${todo.title || 'routine item'}`}
        onPress={() => deleteTodo(todo.id)}
      >
        <Entypo name="circle-with-cross" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.ui}>
        <ScrollView style={{ paddingTop: 20, paddingLeft: 15, paddingBottom: 400 }}>
          <>
            {!!title && <Text style={styles.title}>{title}</Text>}

            {todos.filter((t) => !t.checked).map(renderTodoCard)}

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
                    accessibilityLabel="Routine title"
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
                    value={inputT}
                    onChangeText={setInputT}
                    returnKeyType="done"
                  />
                  <TextInput
                    placeholder="New Routine..."
                    accessibilityLabel="Routine description"
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
                    value={input}
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
                        accessibilityRole="button"
                        accessibilityLabel={`Pick color ${item.colour}`}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          margin: 5,
                          borderColor: 'white',
                          borderWidth: 2,
                          backgroundColor: item.colour,
                        }}
                        onPress={() => {
                          setColourk(item.colour);
                          setColourt(item.text);
                        }}
                      />
                    )}
                    keyExtractor={(item) => item.id.toString()}
                  />
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel="Submit routine item"
                    onPress={() => {
                      if (!input && !inputT) {
                        Alert.alert(
                          'Text field error',
                          'Check your Title or Routine, either is empty',
                          [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'OK' },
                          ],
                        );
                      } else {
                        addTodo(inputT, input, colourt, colourk);
                        setInput('');
                        setInputT('');
                        setColourt('black');
                        setColourk('white');
                        setVisible(false);
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
            {todos.filter((t) => t.checked).map(renderTodoCard)}
          </>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ui: {
    flex: 1,
    width: '95%',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    paddingBottom: 20,
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
});

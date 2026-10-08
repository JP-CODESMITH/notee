import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Divider, TextInput } from 'react-native-paper';
import {
  RichEditor,
  RichToolbar,
  actions,
} from 'react-native-pell-rich-editor';
import { SafeAreaView } from 'react-native-safe-area-context';
import ill from '../assets/images/ill.png';
import Screen from '../components/modal';

export default function NotionLikeEditor() {
  const richText = useRef<RichEditor | null>(null);
  const [title, setTitle] = useState('');
  const [input, setInput] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [pinned, setPinned] = useState(false);
  const [finish, setFinish] = useState(false);
  const [search, setSearch] = useState(false);
  const [visible, setVisible] = useState(false);
  const [modal, setModal] = useState(false);
  const [modall, setModall] = useState(false);
  const [colourd, setColourd] = useState('white');
  const [content, setContent] = useState('');

  const colours = [
    { id: 1, colour: '#C8C5CB' },
    { id: 2, colour: '#F7DEE3' },
    { id: 3, colour: '#EFE9F7' },
    { id: 4, colour: '#DAF6E4' },
    { id: 5, colour: '#FDEBAB' },
    { id: 6, colour: '#F7F6D4' },
    { id: 7, colour: '#EFEEF0' },
  ];
  const saveNote = async () => {
    try {
      const html = await richText.current?.getContentHtml();

      const dbString = await AsyncStorage.getItem('notesDB');
      let db = dbString
        ? JSON.parse(dbString)
        : { idea: [], guidance: [], goals: [], routine: [], buying: [] };

      console.log(content);

      const newNote = {
        id: Date.now(),
        type: 'idea',
        title,
        rich: html || content, // ✅ prefer editor's content
        pin: pinned,
        finished: finish || false,
        backgroudcolor: colourd,
      };

      db.idea.push(newNote);
      await AsyncStorage.setItem('notesDB', JSON.stringify(db));
      Alert.alert('Saved', 'Your note has been saved!');
      router.back();
    } catch (error) {
      console.log('Error saving note:', error);
    }
  };

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', (e) =>
      setKeyboardHeight(e.endCoordinates.height),
    );
    const hideSub = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardHeight(0),
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colourd }]}>
      {!search ? (
        <View
          style={{
            height: 60,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
            justifyContent: 'space-between',
            backgroundColor: colourd,
          }}
        >
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color={'#6A3EA1'} />
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
      ) : null}

      <KeyboardAvoidingView>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: keyboardHeight }}
        >
          {!title ? (
            <TextInput
              placeholder="Enter your Todo Title"
              style={{
                fontSize: 30,
                backgroundColor: colourd,
                fontFamily: 'InterBold',
                fontWeight: 'bold',
              }}
              value={input}
              onChangeText={setInput}
              maxLength={40}
              numberOfLines={2}
              onSubmitEditing={() => {
                setTitle(input);
                setInput('');
              }}
              returnKeyType="done"
            />
          ) : (
            <>
              <Text style={[styles.title, { fontFamily: 'InterBold' }]}>
                {title}
              </Text>
              <RichEditor
                ref={richText}
                style={[styles.editor, { backgroundColor: colourd }]}
                placeholder="Start writing..."
                initialHeight={300}
                onChange={(text) => setContent(text)} // ✅ save html to state
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
                  richText.current?.insertImage(
                    'https://placekitten.com/300/200',
                  )
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
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
      {!title ? (
        <></>
      ) : (
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
      )}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: { fontSize: 40, fontWeight: 'bold', fontFamily: 'InterBold' },
  editor: {
    flex: 1,
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    fontFamily: 'InterRegular',
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
    width: '55.5%',
    flex: 1,
    height: '100%',
    justifyContent: 'center',
  },
  footerRight: {
    flexDirection: 'row',
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '44.4%',
    gap: 5,
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
});

import React from "react";
import { Modal, View, StyleSheet } from "react-native";

export default function Screen({ visible, svisible, children,colour}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={() => svisible(false)}
    >
      <View style={styles.overlay}>
        <View style={[styles.content, {backgroundColor: colour}]}>
          {children}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    width:"100%",
    height: "100%"
  },
  content: {
    width: "100%",
    height:"60%",
    backgroundColor: "white",
    position: "absolute",
    bottom:0,
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    minWidth: "100%",
  },
});

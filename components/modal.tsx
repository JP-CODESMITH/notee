import React, { type ReactNode } from "react";
import { Modal, Pressable, StyleSheet } from "react-native";

interface ScreenProps {
  visible: boolean;
  svisible: (v: boolean) => void;
  children: ReactNode;
  colour?: string;
  /** Backwards-compat alias used by some screens (`color=`) */
  color?: string;
}

export default function Screen({ visible, svisible, children, colour, color }: ScreenProps) {
  const backgroundColor = colour ?? color ?? "white";
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={() => svisible(false)}
    >
      <Pressable
        style={styles.overlay}
        accessibilityRole="button"
        accessibilityLabel="Close dialog"
        onPress={() => svisible(false)}
      >
        <Pressable style={[styles.content, { backgroundColor }]} onPress={(e) => e.stopPropagation()}>
          {children}
        </Pressable>
      </Pressable>
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

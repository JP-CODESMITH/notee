import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ACTION_BAR_BOTTOM } from '../constants/layout';

export type SelectionAction = {
  label: string;
  color: string;
  onPress: () => void;
  /** Destructive actions get a tinted background so they read as distinct. */
  destructive?: boolean;
};

type SelectionBarProps = {
  actions: SelectionAction[];
  /** Override the docked offset (used when two bars stack). */
  bottom?: number;
};

/**
 * Docked selection toolbar shown after long-pressing notes.
 *
 * It lives in its own chrome zone above the floating tab bar (solid
 * background + shadow) so actions never read as part of the card grid, and
 * screens add matching bottom padding while it is visible so content never
 * slides underneath it.
 */
export default function SelectionBar({
  actions,
  bottom = ACTION_BAR_BOTTOM,
}: SelectionBarProps) {
  return (
    <View style={[styles.bar, { bottom }]}>
      {actions.map((action) => (
        <TouchableOpacity
          key={action.label}
          accessibilityRole="button"
          accessibilityLabel={action.label}
          onPress={action.onPress}
          style={[styles.action, action.destructive && styles.destructive]}
        >
          <Text style={[styles.label, { color: action.color }]}>
            {action.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  action: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    minHeight: 48,
    borderRadius: 10,
  },
  destructive: {
    backgroundColor: '#FDECEC',
  },
  label: {
    fontSize: 18,
    fontFamily: 'InterBold',
    fontWeight: '600',
  },
});

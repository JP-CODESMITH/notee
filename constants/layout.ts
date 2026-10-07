/**
 * Shared spacing for screens inside the `(tabs)` group.
 *
 * The custom floating tab bar in `app/(tabs)/_layout.tsx` is absolutely
 * positioned (`bottom: 25`, `height: 70`), so it overlays roughly the bottom
 * 95px of every tab screen. Screens must reserve at least this much space at
 * the bottom of scrollable content and floating action bars.
 */

/** Bottom padding for scrollable content so the last row clears the tab bar. */
export const TAB_BAR_CLEARANCE = 120;

/** `bottom` offset for floating action bars so they sit above the tab bar. */
export const ACTION_BAR_BOTTOM = 108;

/**
 * Bottom padding for scrollable content while a selection bar is visible,
 * so the last row never slides underneath the docked toolbar.
 */
export const SELECTION_BAR_CLEARANCE = TAB_BAR_CLEARANCE + 84;

/** Vertical offset of a second stacked selection bar. */
export const STACKED_BAR_OFFSET = ACTION_BAR_BOTTOM + 80;

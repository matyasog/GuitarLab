// Size classes (docs/decisions.md, 2026-10-13 · Responsiveness).
// - compact: small or short phones, e.g. 360 × 640 Android and iPhone SE (375 × 667)
// - regular: typical phones, 390–430 pt wide (the design's 390 × 844 frames)
// - wide:    tablets; content is centred with a max width, not redesigned
//
// The rules use the short and the long side of the window, so a phone in landscape
// (the Practice screen) keeps the same class as in portrait.
export type LayoutClass = 'compact' | 'regular' | 'wide';

export const layoutBreakpoints = {
  // A phone whose long side is shorter than this gets the compact layouts (360 × 640 frames).
  compactMaxLongSide: 700,
  // Very narrow phones are compact even when tall.
  compactMaxShortSide: 359,
  // From this short side up, the device is treated as a tablet.
  wideMinShortSide: 600,
} as const;

// Max width of screen content on wide screens. Not in the design (it has no tablet frames);
// a little wider than the largest phone so phone layouts don't stretch.
export const wideContentMaxWidth = 480;

export function getLayoutClass(width: number, height: number): LayoutClass {
  const shortSide = Math.min(width, height);
  const longSide = Math.max(width, height);

  if (shortSide >= layoutBreakpoints.wideMinShortSide) {
    return 'wide';
  }
  if (longSide < layoutBreakpoints.compactMaxLongSide || shortSide <= layoutBreakpoints.compactMaxShortSide) {
    return 'compact';
  }
  return 'regular';
}

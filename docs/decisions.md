# Technical decisions log

Short log of important decisions for the thesis: date, decision, reason, alternatives considered.

---

## 2026-10-13 · Design tool: pen.dev

**Decision:** Redesign the Claude Design prototype (v2) in pen.dev. The `.pen` file lives in the Git repo next to the code.

**Reason:**

- Runs on Windows.
- Claude can do most of the design work through the built-in agent or MCP.
- The design file is version-controlled with the code, which documents how the design evolved.
- No weekly MCP limit like Paper's free plan.
  **Alternatives:**
- Paper (paper.design): best for hand-polishing visuals, but its free plan allows only 100 MCP calls per week, and its code export is web React + Tailwind, not React Native.
- Staying in Claude Design: rejected because its export is HTML or a Claude Code bundle, with no design file to keep in the repo.
  **Note:** Neither tool exports React Native code. Design tools give us tokens and visual reference; the RN components are written by hand (with Claude) so every line can be understood and defended.

---

## 2026-10-13 · Visual direction: "analog instrument" for tools, "quiet studio" elsewhere

**Decision:**

- Tuner and Metronome are rendered as realistic physical objects: a strobe tuner in a wooden case with a brass bezel, and a wooden pyramid metronome with a brass pendulum.
- All other screens use a calm "quiet studio" style: matte warm-graphite surfaces, hairline borders, restrained colour, refined type.
  **Reason:** The v2 "pedalboard" look felt cartoonish. Concentrating realism on the two tools makes them the highlight while keeping scope and performance cost low.

**Alternatives:**

- A. Boutique pedalboard: the realistic evolution of v2.
- B. Studio rack: VU-needle tuner, rack-unit metronome.
- Full-app realism: too much work, and too heavy for performance.
  **Kept from v2:** screens, states and copy; colour roles (amber = act/now, brass = achievement, green = correct, red = error); DM Mono for numbers.

---

## 2026-10-13 · Realism rules (instruments)

1. One light source, top-left, applied consistently.
2. Depth comes from shadows, gradients and highlights, never from thick borders or outlines.
3. Colour comes from light: bodies are wood, brass, cream or black; only displays, LEDs and the strobe glow.
4. Proportions are copied from real objects.
5. Labels are small, crisp silkscreen or engraving text.
6. The strobe always comes with the big note name, cents, Hz and the plain-language instruction, because beginners don't know how to read a strobe.

---

## 2026-10-13 · Responsiveness

1. **Fluid layout:** flexbox only (`flex`, `gap`, `aspectRatio`); no fixed screen widths or absolute positioning of UI controls.
2. **Safe areas:** use `react-native-safe-area-context` (included with Expo Router); never hard-coded top or bottom padding.
3. **Size classes** defined once in `src/theme/`:
   - compact: small phones, about 360×640 and iPhone SE
   - regular: typical phones, 390–430 wide
   - wide: tablets; content is centred with a max width, not redesigned
     The hook `useLayoutClass()` in `src/hooks/` is based on `useWindowDimensions()`.
4. **Instruments scale, text and spacing do not.** Instruments are vectors or images in a fixed aspect-ratio frame, scaled to the available space. Text follows the type scale and the system font size; labels inside instruments get a capped `maxFontSizeMultiplier`.
5. **Priorities on short screens** are designed in pen.dev (compact frame 360×640). Example: on the tuner, the headstock collapses into a row of 6 string buttons.
6. **Orientation:** portrait only, except Practice, which uses landscape via `expo-screen-orientation`. Changing `app.json` requires a new Android dev build.
7. **Test matrix:**
   - iPhone in Expo Go
   - Android phone with the dev build
   - Android Studio emulators: small phone (360×640) and tablet
   - every screen at the largest system font size

---

## 2026-10-13 · Performance

Goal: smooth and professional, with optimisation considered at all times.

1. **Animations run on the UI thread**, using Reanimated shared values, never React state per frame. The pitch detector sends about 30 values per second; the native side draws at 60 fps.
2. **Strobe:** the pattern is drawn once; each frame only shifts its offset (speed is proportional to cents; it freezes when in tune).
3. **Pendulum follows the audio clock.** The click sound is the master timing source, so the pendulum never drifts out of sync.
4. **Layered instruments:**
   - static body baked into one image
   - at most 3 moving layers
   - a static glass overlay
5. **Materials are baked:** wood, brass and glass are optimised WebP images at @2x/@3x or simple Skia gradients, loaded once.
6. **Few native shadows:** at most one soft shadow per card and none on list rows; no blur on moving parts.
7. **Measure, don't guess:** check with the performance monitor on Android and in a release build. Expo Go and dev mode are slower than the real app.
8. **Candidate libraries,** each to be confirmed (Expo Go compatibility) before adding:
   - `react-native-reanimated`
   - `@shopify/react-native-skia`
   - `expo-image`
   - `expo-screen-orientation`

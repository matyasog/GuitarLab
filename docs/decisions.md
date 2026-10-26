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

---

## 2026-10-25 · `CLAUDE.md` imports Expo's `AGENTS.md`

**Decision:** `CLAUDE.md` starts with `@AGENTS.md`, so the general Expo guidance generated by `create-expo-app` is always loaded. Where the two disagree, `CLAUDE.md` wins.
**Reason:** `AGENTS.md` warns that Expo changes every SDK and tells the AI to read the versioned docs, which prevents outdated code. `CLAUDE.md` holds the project-specific rules.
**Known differences (CLAUDE.md wins):** no iOS dev builds (AGENTS.md mentions `npx expo run:ios`); new libraries need my OK first. AGENTS.md's "run lint and typecheck" was adopted into CLAUDE.md. Routes live in `src/app/` as AGENTS.md says (CLAUDE.md said `app/` and was corrected).
**Alternatives:** delete `AGENTS.md` (loses useful Expo-specific warnings); copy its content into `CLAUDE.md` (two copies drift apart).

---

## 2026-10-25 · Stay on Expo SDK 57 until App Store Expo Go moves to SDK 58

**Decision:** Keep the project on SDK 57 (React Native 0.86). Upgrade to SDK 58 as a separate step as soon as the App Store version of Expo Go supports only SDK 58.
**Reason:** The iPhone has no development build, so the project must match the single SDK that the App Store Expo Go runs. SDK 58 was released on 2026-10-21; Expo says the new Expo Go "comes to the App Store and Google Play in the next few weeks" and will support only SDK 58. Until then, Expo Go on the App Store runs SDK 57. Since Expo Go 57, you must be logged in to the same Expo account in the CLI (`npx expo login`) and in the Expo Go app.
**Alternatives:** upgrade now (iPhone could not run the app until the store update ships); `eas go` (builds Expo Go for an iPhone, but needs an Apple Developer account).

---

## 2026-10-25 · The `.pen` design file is read raw with scripts

**Decision:** Read `design/guitarlab.pen` (plain JSON, ~3.9 MB) with small Node scripts in `scripts/design/` instead of a Pencil MCP or loading the whole file into the AI context. The index of the file is `docs/design-map.md`.
**Reason:** The file is too big to read whole. Scripts print exactly what is needed (frames, variables, copy, component use) and can be re-run when the design changes.
**Alternatives:** Pencil MCP (not used in this project); PNG exports only (good for looks, but they hide token names and exact copy). Visual reference PNGs are still exported for the instruments and key screens.

---

## 2026-10-25 · Microphone features run on mock audio until I have an Android phone

**Decision:** Tuner, Practice, Results, Input check, the onboarding low-E step and the metronome's "strums vs click" histogram are built with their full UI, driven by a mock implementation of the `AudioStream` interface in `src/audio/`. Mock sessions do not write real progress to Firestore unless a clearly marked dev flag is on.
**Reason:** Expo Go on the iPhone cannot stream raw microphone audio, and I don't have an Android phone for a development build yet. A mock lets the whole UI be built and tested now; the real implementation replaces it later behind the same interface.
**Alternatives:** wait for the phone (blocks half the app); Android emulator microphone (unreliable latency, not representative).

---

## 2026-10-25 · Authentication: email + password only

**Decision:** Firebase Authentication with email + password (sign up, sign in, password reset, sign out). Auth state persists with `initializeAuth` + `getReactNativePersistence(AsyncStorage)`.
**Reason:** Works in Expo Go with the Firebase JS SDK and no native code, and is simple to explain. The design also shows "Continue with Google", which would need extra native setup or a web OAuth flow; it is out of scope for now.
**Alternatives:** Google sign-in (needs `expo-auth-session` flow or native module, OAuth setup); anonymous auth (no cross-device sync, which the sign-up copy promises).

---

## 2026-10-26 · Metronome engine: expo-audio with a drift-free JavaScript scheduler

**Decision:** The metronome plays preloaded sounds with `expo-audio`. Beat times are computed from the start time on a monotonic clock (`t(n) = t0 + n × period`), and a short timer loop plays each click when it is due. The engine sits behind the `MetronomeEngine` interface in `src/audio/metronome/`. The pendulum restarts its swing on every real click, so the click is the master clock. The metronome stops when the app goes to the background.
**Reason:** `expo-audio` works in Expo Go but has no API to schedule a sound in the future. Computing every beat from the start time means timing errors never add up (no drift); each click can only be a few milliseconds early or late (jitter), which step 4.1 measures on the iPhone.
**Alternatives:** pre-rendered loop of one bar as a WAV file (sample-accurate, but loop seams and re-rendering on every change; kept as fallback); `react-native-audio-api` (sample-accurate, but not in Expo Go; planned for the Android dev build).

---

## 2026-10-26 · Chord data: hand-written shape templates

**Decision:** Chords are stored as hand-written TypeScript: one template per chord shape (interval formula + "root on E" and "root on A" fingerings) that generates voicings for all 12 roots, plus hand-written open voicings for the quick chords. Chord naming in Chord Lab is a pure function that matches the placed notes against the same formulas.
**Reason:** Matches the 18 shapes and voicing labels in the design exactly, small, and every line can be explained. Unit tests check that each generated voicing is named back correctly.
**Alternatives:** the open dataset `tombatossals/chords-db` (MIT licence, thousands of voicings, but different naming and far more than the design needs).

---

## 2026-10-26 · Chord and metronome sounds: synthesis in TypeScript

**Decision:** Strums are synthesised with the Karplus–Strong plucked-string algorithm and rendered into one WAV file per strum; metronome sounds are synthesised the same way. Files are written with `expo-file-system` and played with `expo-audio`.
**Reason:** No audio assets and no licence questions; the strum timing is exact because the whole strum is one buffer; the code is pure and testable and makes a good thesis topic.
**Alternatives:** recorded per-note samples (more realistic; kept as an upgrade if synthesis sounds too artificial); one sample per chord (impossible for a free-form fretboard).

---

## 2026-10-26 · Fretboards and instruments: views, images and Reanimated

**Decision:** Chord Lab and Lesson detail fretboards are React Native views (44 pt tappable cells) over a wood texture image. Instruments use static layers exported from pen.dev as images (`expo-image`) and animate only transforms and opacity with Reanimated. The Tuner's moving parts (lit strobe ring, lamps, arrows) are drawn in code with `react-native-svg`.
**Reason:** pen.dev components can't run in React Native, but their pictures can. Images for the complex materials (wood, brass) plus simple code-drawn moving parts keep rendering cheap and avoid adding export-only frames to the design.
**Alternatives:** Skia for everything (more power, but bigger, harder accessibility and much more drawing work).

---

## 2026-10-26 · Google sign-in waits for the Android development build

**Decision:** The "Continue with Google" / "Sign up with Google" buttons from the design are hidden for now. Google sign-in is added in the Android dev-build phase; the Google provider is not enabled in Firebase until then.
**Reason:** Google sign-in on mobile needs a native library and config plugin, so it can't run in Expo Go (Expo docs). An iOS dev build isn't possible without a Mac and an Apple Developer account.
**Alternatives:** show disabled buttons (shows a feature that doesn't work); web OAuth with `expo-auth-session` in Expo Go (not supported by current Expo docs).

---

## 2026-10-26 · Other setup decisions

- **Auth gating:** `Stack.Protected` route guards with an auth context and `useAuth()` hook (current Expo Router pattern).
- **Security rules:** kept in `firestore.rules` and deployed with the Firebase CLI, only after my OK. The database is in production mode (everything denied) until then.
- **Gamification:** level *n* needs 100 × (n − 1)² XP in total (matches the design's numbers); lesson runs give 40/80/120 XP; metronome and Chord Lab give small capped XP; a streak day is a local calendar day on which the daily goal is met. The 12 achievements are listed in `docs/plan.md` (D9), confirmed 2026-10-26.
- **Fonts:** Google Fonts packages loaded with `useFonts`, because the `expo-font` config plugin doesn't work in Expo Go.
- **Template cleanup:** template files and unused packages are removed in Phase 0.
- **Tests:** `jest-expo` for the pure logic (music theory, gamification rules, scheduler math).
- **Lesson content:** 12 lessons as metadata, 3 with full exercise content, because the mic doesn't work yet.
- **Chord Lab wood:** the fretboard reuses the walnut texture `design/generated-1.png` instead of the remote Unsplash photo in the design, so the app ships only our own generated asset.

---

## 2026-10-26 · Template cleanup

**Decision:** Removed everything left over from `create-expo-app`: example images and tab icons, the `example/` folder, the broken `reset-project` script, the web favicon and web config, and seven unused packages (`expo-symbols`, `expo-glass-effect`, `@expo/ui`, `expo-web-browser`, `expo-device`, `react-native-web`, `react-dom`). `app.json` now uses the dark interface style and `color.bg` (`#13110E`) for the root, splash and Android icon backgrounds. The placeholder app icons stay until there is a real icon.
**Reason:** Every file and dependency in the project should have a reason I can explain. Web is not a target platform, so the web packages aren't needed (they are only optional peer dependencies of `expo` and `expo-router`).
**Alternatives:** keep the unused packages (harmless, but more to explain and update). `app.json` changes only take effect in real builds, so they don't need a new build until the first Android dev build.

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

---

## 2026-10-26 · Upgraded to Expo SDK 58

**Decision:** Upgraded the project from SDK 57 to SDK 58 (React Native 0.88.0, React 19.3.0, Reanimated 4.7, Gesture Handler 3.3). This replaces the "stay on SDK 57" decision of 2026-10-25, as planned.
**Reason:** The App Store version of Expo Go on the iPhone updated to SDK 58 and refused to open the SDK 57 project ("Project is incompatible with this version of Expo Go"). Older Expo Go versions can't be installed on iOS devices.
**How:** `npx expo install expo@^58.0.0 --fix` updated `package.json`, but npm couldn't install it over the old packages (peer conflict between the new Reanimated and the old Worklets). So `node_modules` and `package-lock.json` were deleted and reinstalled from the SDK 58 versions. Checked with `npx expo install --check`, `npx tsc --noEmit`, `npx expo lint` and an iOS bundle export.
**Alternatives:** none realistic: an iOS development build or an older Expo Go would both need things I don't have (Mac / Apple Developer account).

---

## 2026-10-26 · Unit tests with jest-expo

**Decision:** Unit tests run with Jest and the `jest-expo` preset (`npm test`). Test files are named `*-test.ts` and live in `__tests__/` folders. `tsconfig.json` sets `"types": ["jest"]` so test globals (`test`, `expect`) are typed; Node's types (`fs`, `path`) are loaded only inside test files that need them, because app code runs on the phone where they don't exist.
**Reason:** The pure logic (chord naming, gamification rules, metronome timing math, later DSP) is easy to get subtly wrong and easy to test. Tests are also evidence for the thesis. Jest is a development tool only; nothing of it ships in the app or affects Expo Go.
**Alternatives:** no tests, checking by hand (faster now, risky later); Vitest (not the Expo-supported preset).

---

## 2026-10-26 · npm 10 instead of the old global npm 7

**Decision:** Dependencies are installed with npm 10 (the version that comes with Node 22). `package.json` has an `overrides` entry that pins `react-dom` to the same version as `react`.
**Reason:** The PC had a global npm 7.24.2 (2021) that shadowed Node's own npm. npm 7 placed Expo's internal packages in nested folders, which caused expo-doctor's "duplicate dependencies" warning and made Jest fail with "Cannot find module 'expo-modules-core'". A clean install with npm 10 fixed both. npm 10 then failed on any new install because it tried to add the newest optional `react-dom` (19.3.1), which needs a newer React than SDK 58 uses (19.3.0); the override keeps them equal.
**Alternatives:** `legacy-peer-deps=true` in `.npmrc` (silences all peer checks, hiding real problems); keeping npm 7 (broken installs).

---

## 2026-10-26 · Theme tokens and fonts in code

**Decision:** `src/theme/` holds the design tokens with the same names as the `.pen` variables (camelCase): colours, spacing, radii, type sizes, plus named text styles. Each font weight is loaded as its own family (`Archivo_600SemiBold`) with `useFonts`, imported from per-weight subpaths, and text styles choose the family instead of `fontWeight`. A unit test compares every token with the `.pen` file.
**Reason:** Choosing the family per weight renders identically on iOS and Android (Android doesn't reliably pick the right face from `fontWeight` for custom fonts). Per-weight imports bundle only the 6 files the design uses (~560 KB) instead of every weight. The test catches the design and the code drifting apart.
**Alternatives:** one family with `fontWeight` (depends on platform font matching); the `expo-font` config plugin (fonts embedded at build time, faster start, but doesn't work in Expo Go; possible later in the Android dev build).

---

## 2026-10-26 · Size class rules

**Decision:** The size class comes from the window's short and long side: **wide** if the short side is at least 600 pt (tablets), **compact** if the long side is under 700 pt or the short side under 360 pt, otherwise **regular**. On wide screens, content is a centred column of at most 480 pt.
**Reason:** The compact frames in the design (360 × 640) exist for short screens, where the instrument and readouts must still fit; that is about height more than width. Common tall Android phones (360 × 800) have room for the regular layout. Using the short and long side means a phone keeps its class in landscape (Practice). The 480 pt column is not in the design (there are no tablet frames); it is slightly wider than the largest phone so phone layouts don't stretch.
**Note:** My test iPhone is 375 × 667 pt (iPhone SE/8 class), so it shows the compact layouts. The regular layouts are checked on the Android emulator or a bigger phone.
**Alternatives:** width-only breakpoints (would show cramped regular layouts on short phones like the iPhone SE); separate landscape rules (more cases, no design for them).

---

## 2026-10-26 · Icons: lucide-react-native, one import per icon

**Decision:** Icons come from `lucide-react-native` (ISC licence, works in Expo Go on top of `react-native-svg`). `src/components/Icon.tsx` imports each icon the design uses from its own file (`lucide-react-native/icons/play`) and exposes them under the design's names.
**Reason:** The design is drawn with Lucide icons, so the app shows exactly the same shapes and names. Importing one file per icon keeps the other ~1,900 Lucide icons out of the app (React Native's bundler doesn't remove unused exports). Together with `react-native-svg` this added about 0.3 MB to the JS bundle.
**Alternatives:** `@expo/vector-icons` (in Expo Go, but its Lucide-like sets don't match the design's icons exactly); `expo-symbols` (SF Symbols, iOS look only, removed in Phase 0); exporting icons as images (no colour changes, blurry at other sizes).

---

## 2026-10-26 · Password field follows the screens, not the kit

**Decision:** `PasswordField` uses a "Show" / "Hide" text button inside the field, and `TextField` has slots for a label-row accessory ("Forgot password?") and a footer (password rules).
**Reason:** The component kit shows an eye icon, but every screen that uses the field (Sign in, Sign up) overrides it with the "Show" text button, and the v2 spec describes "Show"/"Hide". The screens are what users see, so they win.
**Alternatives:** the eye icon from the kit (would differ from every screen design).

---

## 2026-10-26 · Keeping text fields above the keyboard

**Decision:** `Screen` turns on the scroll view's `automaticallyAdjustKeyboardInsets`: when the keyboard opens on iOS, the screen gets extra scroll room and the focused field scrolls into view.
**Reason:** On the iPhone SE (375 × 667 pt) the keyboard with its suggestion bar covers about half the screen, so the email field on the check screen was hidden while typing. The Sign in and Sign up screens would hit the same problem (hero image, several fields, password rules). The fix is one built-in property in one place, so every screen gets it.
**Alternatives:** `react-native-keyboard-controller` (Expo's recommendation for forms, but not included in Expo Go; possible with the Android dev build); `KeyboardAvoidingView` (built in, but it only shrinks the view and doesn't scroll to the focused field). Android behaviour is still to be checked (plan risk R15).

---

## 2026-10-26 · Overlays with React Native's Modal; text-size caps

**Decision:** `Dialog` and `BottomSheet` use React Native's built-in `Modal`. The sheet's background fades in and the sheet slides up with a Reanimated entering animation; it closes with ✕, a tap outside or the back gesture, not by dragging. Reduce Motion turns off the fade, slide, skeleton pulse and switch animation. Toasts are plain banners placed in the screen content, because that is how the screens in the design use them.
Text-size rule: text scales with the phone setting everywhere except labels inside instruments. One more exception: the "9/15" inside the 48 pt daily-goal ring is capped at 1.2× because it must fit inside a fixed circle, like an instrument label. Tab bar labels are not capped; at the very largest sizes a long label like "Chord Lab" is cut off with "…" rather than breaking the layout.
**Reason:** `Modal` handles the Android back button, screen-reader focus and drawing above everything without extra libraries. Drag-to-close needs gesture handling and is not essential; it can be added later if a sheet feels wrong without it.
**Alternatives:** a bottom-sheet library (e.g. `@gorhom/bottom-sheet`; extra dependency to check for Expo Go); Expo Router modal routes (used for the full-screen "All chords" sheet in step 5.5).

---

## 2026-10-26 · Firebase config in `src/firebase/config.ts`, Auth remembered with AsyncStorage

**Decision:** One file, `src/firebase/config.ts`, creates the Firebase app, Auth and Firestore. Auth uses `initializeAuth` with `getReactNativePersistence(AsyncStorage)` (`@react-native-async-storage/async-storage` 2.2.0, included in Expo Go). The file stops with a clear message if a `.env` value is missing, and reuses the already-created app and Auth on fast refresh. A small declaration file (`src/types/firebase-auth-react-native.d.ts`) tells TypeScript about `getReactNativePersistence`.
**Reason:** Without persistence, Firebase Auth on React Native forgets the user every time the app restarts. AsyncStorage is what both Expo's SDK 58 docs and Expo's Firebase guide use. TypeScript reads Firebase's web type definitions, which leave out this React Native-only function (a known Firebase issue); the app itself loads the React Native build (checked in the iOS bundle), so only the types needed fixing.
**Alternatives:** `expo-sqlite/localStorage` (mentioned by Expo's upgrade tool as a newer option, but not in the SDK 58 docs or the Firebase guide, and it would need a wrapper); `// @ts-ignore` on the import (hides any other error on that line too); React Native Firebase (`@react-native-firebase`, not in Expo Go).

---

## 2026-10-26 · First Firestore rules, deployed from the repo with the Firebase CLI

**Decision:** The security rules are kept in `firestore.rules` in the repo, together with `firebase.json`, `.firebaserc` (project `guitarlab-25e83`) and `firestore.indexes.json`. They are checked with `npx firebase-tools deploy --only firestore:rules --dry-run` and deployed with the same command without `--dry-run`, only after my OK. First version: only the signed-in owner can read or write `users/{uid}` and everything under it; a new profile must have a 1–40 character `displayName` and `createdAt` set by the server; `createdAt` can't be changed; everything else is denied. Deployed 2026-10-26.
**Reason:** The database was created in production mode, so it denied everything and sign-up (step 2.5) could not write a profile. Rules in the repo are versioned with the code, so the thesis can show how they evolved, and a dry run catches mistakes before anything goes live. The Firebase CLI runs through `npx`, so it isn't added to the app's dependencies.
**Alternatives:** editing rules in the console (no history, easy to drift from the code); test-mode rules (open to everyone, expire after 30 days).

---

## 2026-10-26 · Auth state in a React context; routes guarded with `Stack.Protected`

**Decision:** `AuthProvider` (`src/firebase/AuthProvider.tsx`) listens to Firebase's `onAuthStateChanged` and keeps the current user in React state; screens read it with `useAuth()`. The routes are split into two groups: `(auth)` for signed-out screens and `(app)` for everything else. The root layout wraps each group in `Stack.Protected`, so only one group exists at a time. The splash screen stays until the fonts and the saved sign-in are ready. Each guard has `redirectTo` (signed out → `/sign-in`, signed in → `/`); without it, a signed-out user opening `/` was sent to the `(auth)` group, which has no screen at `/`, and saw "Unmatched Route".
**Reason:** This is the pattern in Expo Router's authentication guide for SDK 58. Firebase is the single source of truth for "who is signed in": signing in or out only changes the user, and the guards then show the right screens and remove the other group's history (the back gesture can't return to the app after signing out). Waiting with the splash avoids a flash of the sign-in screen for users who are already signed in.
**Alternatives:** redirecting inside each screen with `<Redirect>` or `router.replace` (older pattern, more code, the wrong screen can flash); a state library such as Redux or Zustand (unnecessary for one value).

---

## 2026-10-26 · Auth error messages

**Decision:** `src/firebase/authErrors.ts` maps each Firebase Auth error code to a short message and to where it is shown (under Email, under Password, or above the Sign in button). Wrong password and unknown account show the same message. Approved copy:

| Code | Shown under | Message |
|---|---|---|
| auth/invalid-email | Email | That doesn't look like an email. Try you@example.com (design) |
| auth/missing-email | Email | Enter your email. |
| auth/missing-password | Password | Enter your password. |
| auth/invalid-credential, wrong-password, user-not-found | Password | That email and password don't match. Check them, or reset your password. |
| auth/too-many-requests | Form | Too many tries. Wait a few minutes, or reset your password. |
| auth/network-request-failed | Form | You're offline. Connect to the internet and try again. |
| auth/user-disabled | Form | This account can't sign in right now. |
| anything else | Form | Something went wrong. Try again. |
| reset without email | Email | Type your email above, then tap Forgot password? again. |
| reset sent | Password (green) | Reset link sent. Check your inbox (and spam, just in case). (design) |

**Reason:** Firebase's own messages ("auth/invalid-credential") mean nothing to a beginner. Each message says what to do next, in the tone of the design's existing copy. Firebase deliberately answers "wrong password" and "no such account" the same way (email enumeration protection), so the app does too; otherwise anyone could test which emails have an account.
**Alternatives:** showing Firebase's messages (technical); one generic "Sign in failed" (doesn't help the user fix it).

---

## 2026-10-26 · Sign up creates the account, then the profile document

**Decision:** `signUp` runs three steps: `createUserWithEmailAndPassword`, `updateProfile` (stores the name on the Firebase account), then `setDoc(users/{uid})` with the defaults from the data model, `createdAt: serverTimestamp()` and the phone's time zone. Inputs are checked on the phone first (`src/firebase/authValidation.ts`): name 1–40 characters, email format, and four password rules shown live under the field: "8+ characters", "A number" (both from the design), "An uppercase letter" and "A lowercase letter" (added at my request for stronger passwords). Email and password are checked when the field loses focus; the rules stay visible under the error. Sign-up copy: "That email already has an account. Sign in instead, or reset your password.", "Your password needs to meet all the rules below." and "Enter a first name or nickname." Upper/lowercase is detected by comparing the password with its lower/upper-case version, so Czech letters like Č count.
**Reason:** Firebase Auth only stores email and password; the app's own data (settings, progress) lives in Firestore under the user's id. The security rules let the profile be created once (server time required, `createdAt` unchangeable), so it can't be overwritten by accident. Checking on the phone gives instant feedback without a network round trip; Firebase's own checks still apply.
**Known gap:** once the account exists, the user is signed in and the route guard opens the app before the profile write finishes. If that write fails, step 3.2 creates the missing profile (plan risk R17).
**Alternatives:** a Cloud Function that creates the profile on the server (reliable, but needs the paid Blaze plan); waiting with navigation until the write finishes (more state to manage for a rare failure).

---

## 2026-10-26 · "Email already has an account" is checked only when creating the account

**Decision:** Unlike the email format and the password rules, "That email already has an account…" appears only after tapping Create account (under the Email field), not when leaving the field.
**Reason:** Only Firebase's server knows which emails are registered, and the project has Email Enumeration Protection on (Firebase's default): it refuses to tell anyone whether an email has an account, so nobody can use the app to collect registered addresses. The old lookup function `fetchSignInMethodsForEmail` is deprecated and returns an empty list while the protection is on. Firebase only reveals the conflict when an account is actually created.
**Alternatives:** turning the protection off (lets anyone test which emails are registered; relies on a deprecated function); a public list of emails in Firestore (exposes users' emails). Both rejected for privacy.

---

## 2026-10-26 · Tab navigation with our own tab bar

**Decision:** The signed-in app uses Expo Router's JavaScript `Tabs` (`expo-router/js-tabs`) with five tabs (Today, Learn, Tuner, Chord Lab, You) and our `TabBar` component passed as `tabBar`. A press emits the `tabPress` event and then calls `navigateToTab`, like the built-in bar. The Tuner tab contains a small stack with Tuner and Metronome, switched without animation by the Tuner | Metronome control (`router.replace`, so "back" never toggles between tools). Screens that have no tab bar in the design live next to the tabs, not inside them.
**Reason:** The design's tab bar (amber LED, warm colours, 50 pt plus safe area) can't be made from the native tab bar's options; a custom component matching the kit can. The JS Tabs navigator is stable; Expo's headless `expo-router/ui` tabs are marked experimental.
**Alternatives:** native tabs (`expo-router/native-tabs`, platform look, can't match the design); headless `expo-router/ui` tabs (experimental); one Tools screen that swaps Tuner/Metronome with React state (no separate routes, so the Lesson's "Tune" link couldn't open the tuner directly).

---

## 2026-10-26 · Third tab is "Tools", not "Tuner"

**Decision:** The tab that holds the Tuner and the Metronome is labelled **"Tools"** with the audio-waveform icon, instead of the design's "Tuner" with a speaker icon. Inside, the Tuner | Metronome switch stays as designed.
**Reason:** With the label "Tuner", someone looking for the metronome has no reason to open that tab. "Tools" says the tab holds more than one tool, and keeps the five-tab bar of the design. The sliders icon was not used because the design already uses it for the Settings button.
**Alternatives (I chose among these):** a separate Metronome tab (six tabs, ~62 pt each on a 375 pt phone; Apple recommends 3 to 5); Metronome as a tab and You moved to the Today level badge (profile less visible); a tab whose label follows the last-used tool (a new user still can't see the metronome).

---

## 2026-10-26 · One live profile listener for the signed-in app

**Decision:** `ProfileProvider` (wrapping the signed-in routes) listens to `users/{uid}` with Firestore's `onSnapshot` and shares it through `useProfile()`. Settings are saved field by field (`updateDoc` with `settings.dailyGoalMin` etc.). If the document is missing, `ensureUserProfile` creates it in a transaction (read, then write only if still missing), but only when the answer comes from the server, not the offline cache. Sign-up uses the same function.
**Reason:** One listener serves every screen and keeps the profile up to date, also when it changes on another device. Firestore applies local writes to its cache at once, so a setting changes on screen immediately and is sent in the background (also queued while offline). Saving single fields means two quick changes can't overwrite each other. The transaction makes "create the profile" safe even if sign-up and the listener try at the same moment, which closes the gap where an account could end up without a profile (plan risk R17).
**Alternatives:** reading the profile once per screen with `getDoc` (no live updates, more reads); saving the whole `settings` object (a fast second change could undo the first).

---

## 2026-10-26 · Slider built on React Native's touch responder

**Decision:** The input-sensitivity slider is our own small component (`src/components/Slider.tsx`) using the View's built-in touch-responder props (`onResponderGrant`, `onResponderMove`, `onResponderRelease`): the finger's x position inside the slider becomes the value, in steps of 5. It saves only when the finger lifts, and screen readers adjust it with swipe up/down.
**Reason:** The design's slider (4 pt amber rail, round thumb) can't be styled from the system slider, and the community slider would be an extra dependency. A first version with `PanResponder` kept the latest values in refs, which the React Compiler's lint rule forbids during render; the responder props need no refs at all.
**Alternatives:** `@react-native-community/slider` (in Expo Go, but native look); a Gesture Handler pan gesture (more setup for one control).

---

## 2026-10-26 · Onboarding shown by a second route guard

**Decision:** Inside the signed-in part, `(app)/_layout.tsx` waits for the profile and then uses `Stack.Protected` again: while `onboarding.completedAt` is empty only the onboarding screens exist; afterwards only the tabs and Settings. Finishing onboarding ("Let's play" or "Not now, I'll look around first") writes `completedAt` with the server time, and the guard switches to Today. Answers are saved when tapping Continue (level to `onboarding.level`, guitar/hand/pegs to `settings`).
**Reason:** The same pattern as sign-in keeps the logic in one place and needs no manual navigation; the back gesture can't return into onboarding once it's done. Keeping the answers in the profile means the user also finds them in Settings.
**Alternatives:** a flag in the phone's storage (lost on reinstall or a second device); redirecting from the Today screen (the tabs would flash first).

---

## 2026-10-26 · Lessons as static data; sample progress until Phase 6

**Decision:** The 12 lessons from the design are TypeScript data in `src/data/lessons.ts` (title, category, tempo, goal tempo, difficulty, unlock rule). The grouping into In progress / Up next / Locked / Done and the unlock sentence are pure functions in `src/data/lessonSections.ts`, unit-tested. Screens get progress from `useLessonProgress()`, which returns sample progress copied from the design until the real Firestore progress exists (step 6.4). In development, `?preview=loading` / `?preview=error` shows the loading and error states.
**Reason:** Lessons are the same for every user and must work offline, so they ship with the app; only scores are personal and live in Firestore. Keeping the progress behind one hook means the Learn screen won't change when the sample is replaced. The preview parameter lets the designed loading and error states be checked on the phone before anything actually loads.
**Alternatives:** lessons in Firestore (needs network, nothing to edit there yet); building Learn only after Phase 6 (no way to check the design now).

---

## 2026-10-26 · Lesson status comes from the best score

**Decision:** Only each lesson's best score is stored; its status is worked out in the app (`lessonStatus` in `src/data/lessonSections.ts`): **locked** while the required lesson's best score is below its unlock score (80 %), **done** from a best score of **90 %**, **in progress** when played but below 90 %, **up next** when never played. Unlock prerequisites: A minor pentatonic after E minor pentatonic (design), Syncopated strumming after Eighth notes, Cmaj7 arpeggio after A minor arpeggio (both confirmed by me).
**Reason:** The design's example data was inconsistent ("Triplet feel" listed as done at 78 % while unlocking needs 80 %), so it couldn't serve as the rule. A stored status could disagree with the score; a computed one can't, and it is easy to unit-test. 90 % for "done" asks for real mastery, while 80 % is enough to move on to the next lesson.
**Alternatives:** done at 80 % (same as unlock; "done" would mean little); storing the status in Firestore (two sources of truth).

---

## 2026-10-26 · Lesson detail: tempo rule, shapes and "coming soon"

**Decision:** The three tempo tiles are worked out from the lesson (`tempoOptions` in `src/data/lessonTempo.ts`, unit-tested): warm-up = suggested − 8 BPM, suggested = the lesson's tempo, goal = the lesson's goal tempo or suggested + 8. Fretboard shapes are hand-written note lists (`src/data/lessonShapes.ts`) for four open-position lessons (E minor pentatonic from the design, Chromatic warm-up, C major scale, A minor arpeggio); rhythm, melody and 5th-position lessons show no diagram. The fretboard (`ScaleShape`) is plain React Native views: one column per fret, strings drawn across, a dot per note; it mirrors with `row-reverse` for left-handed players. Lessons without exercises show a "coming soon" toast when Play is pressed. Never-played lessons show "–" as best score and 0 runs. Description copy for Quarter notes and Chromatic warm-up, the coming-soon copy and the error/not-found copy were approved by me.
**Reason:** The design shows one lesson only (64 / 72 / 80 for a 72 BPM lesson with goal 80), so a rule that reproduces it is needed for the other eleven. Views instead of SVG keep the board accessible and consistent with Chord Lab (D4). Mirroring the layout direction (not the whole picture) keeps the note names readable.
**Alternatives:** warm-up at 90 % of the tempo (gives 65, not the design's 64); a picture of the board (can't mirror or change per lesson); hiding Play for lessons without exercises (the design always shows it).

---

## 2026-10-27 · Today: what the session card and Up next show; offline detection

**Decision:** `src/data/todayPicks.ts` (unit-tested) picks the session lesson: nothing played yet → Quarter notes ("Your first session"); otherwise the in-progress lesson **with exercises** that has the lowest best score; otherwise the first new one. "Up next" shows the weakest other in-progress lesson, then new lessons, easiest first (2 rows). The kicker is "Tonight's session" from 17:00 and "Today's session" before. Level, streak, week and minutes today are SAMPLE numbers from the design (`useTodaySummary`) until step 6.4; the greeting and daily goal come from the real profile. The offline banner uses `@react-native-community/netinfo` (works in Expo Go, no config plugin).
**Reason:** Both rules reproduce exactly what the regular and first-day designs show, and point the user at the lesson that needs most work. Only lessons with exercises can be played, so only they can be the session. NetInfo reports the connection directly; Firestore's cache flags can't tell offline from "not answered yet".
**Alternatives:** the most recently played lesson (no play history yet); a hand-picked lesson per day; detecting offline from Firestore `fromCache`.

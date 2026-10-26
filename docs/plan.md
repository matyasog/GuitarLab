# GuitarLab development plan

Status: **decisions approved 2026-10-26**; waiting for the go-ahead to start Phase 0. No phase has started.
Tick steps (`[x]`) as they are finished and note any change to the plan in the changelog at the bottom.

Contents: 1. Audit · 2. Decisions to make · 3. Phases and steps · 4. Risks · 5. Manual tasks for me · 6. Open questions · 7. Changelog

---

## 1. Audit (2026-10-25)

### 1.1 Repo and Expo

- **Expo SDK 57** at the audit (`expo ~57.0.28`, React Native 0.86.3, React 19.2.3, TypeScript ~6.0.3); **upgraded to SDK 58 on 2026-10-26** (step U.1: React Native 0.88.0, React 19.3.0). `tsconfig.json` has `"strict": true` and the alias `@/*` → `src/*`.
- **Expo Go on the iPhone:** the App Store version of Expo Go currently runs SDK 57 ([Expo changelog, 3 Sep 2026](https://expo.dev/changelog/expo-go-57-login)), and Metro logs show iOS bundles were already served. It works today. **But** SDK 58 was released on 21 Oct 2026, and Expo says the new Expo Go "comes to the App Store and Google Play in the next few weeks" and supports **only** SDK 58 ([upgrade guide](https://expo.dev/blog/how-to-upgrade-to-sdk-58)). When that happens, the project must be upgraded to SDK 58 the same day, or the iPhone can't open it. Step **U.1** below covers this.
- Expo Go 57 requires being logged in to the same Expo account in `npx expo login` and in the Expo Go app (iOS).
- Routes are in **`src/app/`** (the template's layout). `CLAUDE.md` said `app/`; corrected.
- `app.json`: `userInterfaceStyle: "automatic"` (should be `"dark"`), template splash colour `#208AEF`, template Android icon colours, `orientation: "portrait"`, `experiments.typedRoutes` and `reactCompiler` on. No `eas.json`, no `metro.config.js`, no `babel.config.js` (defaults are fine).
- `.gitignore` already ignores `.env` (a line was added to Expo's default) and `/example`.
- Git: clean, on `master`, 5 commits.

**Template leftovers (nothing deleted yet):**
- `example/` (the original template app, git-ignored): `src/app/explore.tsx`, tabs, themed components, `constants/theme.ts`, `scripts/reset-project.js`
- `package.json` script `"reset-project": "node ./scripts/reset-project.js"`, which points to a file that no longer exists
- `src/app/index.tsx` ("Edit src/app/index.tsx…") and `src/app/_layout.tsx` (bare `Stack`)
- `assets/images/`: `expo-badge.png`, `expo-badge-white.png`, `expo-logo.png`, `logo-glow.png`, `react-logo*.png`, `tutorial-web.png`, `tabIcons/explore*`, `tabIcons/home*`
- placeholder app icons: `assets/expo.icon/`, `icon.png`, `android-icon-*.png`, `splash-icon.png`, `favicon.png` (keep until there is a real icon)
- `README.md` (template text), `LICENSE`
- `.vscode/settings.json` sorts object members on save (`source.sortMembers`), which will reorder code; consider removing.

**Installed libraries:**

| Library | Expo Go | Needs dev build | Config plugin | Used by us? |
|---|---|---|---|---|
| expo, expo-router | yes | no | expo-router (in app.json) | yes |
| expo-constants | yes | no | no | yes (Expo Go detection) |
| expo-font | yes | no | optional (`useFonts` works in Expo Go; the plugin only in dev builds) | yes |
| expo-splash-screen | yes | no | yes (in app.json; config only applies to real builds) | yes |
| expo-status-bar, expo-system-ui, expo-linking | yes | no | no | yes |
| expo-image | yes | no | no | yes (textures, instrument layers) |
| expo-device | yes | no | no | probably not |
| expo-web-browser | yes | no | no | probably not |
| expo-symbols | yes | no | no | no (design uses Lucide icons) |
| expo-glass-effect | yes | no | no | no (iOS liquid glass; not in the design) |
| @expo/ui | yes | no | no | no |
| react-native-reanimated 4.5 + react-native-worklets | yes | no | no (babel preset handles it) | yes |
| react-native-gesture-handler | yes | no | no | yes (bottom sheet, maybe) |
| react-native-safe-area-context, react-native-screens | yes | no | no | yes |
| react-native-web, react-dom | n/a (web only) | no | no | no (web not a target) |
| firebase 13.0.0 (JS SDK) | yes (pure JS) | no | no | yes |

**`AGENTS.md` vs `CLAUDE.md`:**
1. Routes in `src/app/` (AGENTS) vs `app/` (CLAUDE): the repo uses `src/app/`, so `CLAUDE.md` was fixed.
2. AGENTS suggests `npx expo run:ios` / iOS builds: not possible here (no Mac); CLAUDE wins.
3. AGENTS: "Run lint and typecheck before declaring any task done"; CLAUDE only mentioned `tsc`. Both are now in `CLAUDE.md`.
4. AGENTS: run EAS as `npx eas-cli@latest`; `CLAUDE.md` used bare `eas`. Fixed.
5. AGENTS mentions `bunx`: not relevant (npm, `package-lock.json`).

### 1.2 Firebase

What `src/lib/firebase.ts` does (note: it is in `src/lib/`, not `lib/`): it reads the 6 web-config values from `EXPO_PUBLIC_FIREBASE_*` env variables, initialises the Firebase app once (reusing it on fast refresh), and creates a **Firestore** client (`db`). It does **not** set up Authentication at all, so there is no `getReactNativePersistence` yet.

In plain language:
- **Firebase app config** (apiKey, projectId, …) = the address of your Firebase project. It is not a password. Anyone who has the app can read it, so security comes from **Authentication** (who you are) and **Firestore security rules** (what you may read/write).
- **Authentication** = accounts (email + password). Needs to be enabled in the console.
- **Firestore** = the cloud database where profiles and progress live.
- **AsyncStorage** = small key-value storage on the phone; Firebase Auth uses it to remember that you're signed in after the app restarts.
- **Security rules** = the server-side gatekeeper. In "test mode" they let anyone read and write everything until a date about 30 days after creation, then block everything.

| Item | Status | What to do |
|---|---|---|
| `src/lib/firebase.ts` initialises app + Firestore from env vars | Done | Moved to `src/firebase/config.ts` in step 2.1 (2026-10-26) |
| Keys hard-coded in code | Done (no) | They come from `EXPO_PUBLIC_*` env variables |
| Auth initialised with `initializeAuth` + `getReactNativePersistence(AsyncStorage)` | Done (2.1) | — |
| `@react-native-async-storage/async-storage` installed | Done (2.1) | 2.2.0, pinned by SDK 58; in Expo Go |
| `.env` exists with 6 values (project `guitarlab-25e83`) | Done | — |
| `.env` git-ignored | Done | `.gitignore` line `.env`; `git check-ignore` confirms |
| `.env` ever committed | Done (never) | Git history has no `.env` and no API key, so nothing to rotate |
| `.env.example` | Missing | Step 0.2 |
| `metro.config.js` Firebase settings | Done (none needed) | Expo's current Firebase guide: Firebase JS SDK ≥ 12 needs no extra Metro config; older versions caused ES-module errors |
| TypeScript types for `getReactNativePersistence` | Done (2.1): the error appeared; fixed with `src/types/firebase-auth-react-native.d.ts` | `firebase/auth`'s type entry points to the web typings; an open Firebase issue reports the TS error "no exported member 'getReactNativePersistence'" on v12 while runtime works. Fix if it appears: import types from the RN entry or a small typed shim, explained in a comment |
| `firestore.rules`, `firebase.json` in repo | Missing | Step 2.2 |
| Which Firebase project and web app the config belongs to | Done | Checked 2026-10-25 via Firebase MCP: project `guitarlab-25e83` ("GuitarLab", created 13 Oct 2026), one web app "GuitarLab"; its App ID matches `.env`. No Android/iOS apps (not needed) |
| Email/Password sign-in enabled | Done | Confirmed in the console 2026-10-25 |
| Firestore location | Done | `europe-central2` (Warsaw); cannot be changed later |
| Firestore in test mode, expiry date | Done (not test mode) | Rules are production mode: `allow read, write: if false;` for everything. Nothing expires, but the app can't read/write until our rules are deployed in step 2.2, which must come before sign-up (2.5) |
| Firebase MCP (read-only check) | Done | Used read-only on 2026-10-25 (project, apps, rules); nothing changed |

**Console checklist** (console.firebase.google.com, signed in with the Google account you used):

A. *Project and web app*
1. Open the project list; you should see a project whose ID is `guitarlab-25e83`. Open it.
2. Click the gear icon next to "Project Overview" → **Project settings** → **General** tab.
3. Scroll to **Your apps**. There should be one app with the `</>` (web) icon. Note its nickname. Its App ID must start with the same digits as `EXPO_PUBLIC_FIREBASE_APP_ID` in `.env`.
4. Check that there are no extra apps you don't recognise (Android/iOS apps aren't needed for the JS SDK).

B. *Authentication*
1. Left menu → **Build** → **Authentication**. If you see "Get started", Auth was never enabled: click it.
2. **Sign-in method** tab. Is **Email/Password** listed as *Enabled*? If not: click it → turn on the first switch (Email/Password), leave "Email link" off → Save.
3. **Settings** tab → **Authorized domains**: no change needed for a mobile app.
4. (Optional) **Templates** tab → Password reset: you can set the sender name to "GuitarLab" later.

C. *Firestore*
1. Left menu → **Build** → **Firestore Database**.
2. At the top of the **Data** tab, note the database name (usually `(default)`). In **Project settings → General**, "Default GCP resource location" shows the **location** (e.g. `eur3` or `europe-west3`). It can't be changed later; just note it.
3. Open the **Rules** tab. If it contains `allow read, write: if request.time < timestamp.date(2026, 11, …);` it's **test mode**, and the date is the expiry date. Write it down. If it says `allow read, write: if false;` it's production mode (locked; the app can't read/write until we deploy our rules).
4. Don't change anything; tell me what you found.

### 1.3 Design file

- `design/guitarlab.pen`: 3.9 MB plain JSON (`version 2.21`, top-level keys `version`, `children`, `variables`, `fileToken`). 85 top-level frames, 64 reusable components, 91 variables, 46 Lucide icons.
- Screens, states, tokens, fonts, instrument layers, assets and gaps are indexed in **`docs/design-map.md`**.
- Design brief: `design/guitarlab design/SKILL.md` exists (folder name has a space, not a hyphen). `docs/decisions.md` exists.
- Practice **is** designed (landscape 844×390 + compact 640×360, states K1–K10, motion spec).
- Chord Lab is **not** a "browse a library" screen: it's an interactive fretboard that names whatever chord you place, plus an "All chords" sheet (12 roots × 18 shapes). This makes it the biggest non-audio feature.
- Analysis script: `scripts/design/inspect-pen.js` (commands `summary`, `frames`, `tree`, `texts`, `refs`, `find`).

---

## 2. Decisions

**Chosen on 2026-10-26** (all recommendations accepted; details per decision below):

| # | Topic | Choice |
|---|---|---|
| D1 | Metronome engine | expo-audio + drift-free JS scheduler; stops when the app goes to the background |
| D2 | Chord data | hand-written shape templates + open voicings |
| D3 | Chord and metronome sounds | Karplus–Strong / simple synthesis rendered to WAV in TypeScript |
| D4 | Fretboards | React Native views + wood texture |
| D5 | Instruments | static body + glass exported as images; moving parts drawn in code |
| D6 | Auth gating | `Stack.Protected` + auth context |
| D7 | Firebase migration | as described |
| D8 | Security rules | `firestore.rules` in the repo, CLI deploy with your OK |
| D9 | Gamification | proposal accepted as the starting point; achievements list is a proposal |
| D10 | Fonts | `@expo-google-fonts/*` + `useFonts` |
| D11 | Template cleanup | remove template files and unused packages in Phase 0 |
| D12 | Tests | add `jest-expo` in Phase 0 |
| D13 | Google sign-in | not possible in Expo Go; buttons hidden for now, added in the Android dev-build phase |
| D14 | Lesson content | 12 lesson entries (metadata from the design), 3 with full exercise content |

Each decision lists options, my recommendation and why. Library support was checked against the SDK 57 docs on 2026-10-25.

### D1. Metronome engine in Expo Go

Facts: `expo-audio` (in Expo Go) can preload sounds (`preload`, `createAudioPlayer`) and play them, but it has **no API to schedule a sound at a future time** and no AudioContext. Sample-accurate scheduling needs `react-native-audio-api`, which is **not** in Expo Go (dev build only).

| Option | How it works | Timing in Expo Go | Effort |
|---|---|---|---|
| **A. expo-audio + drift-free JS scheduler** | Preload click/accent players (a small pool per sound so a click can start while the previous one rings). Beat times are computed from a start time on the monotonic clock (`performance.now()`): `t(n) = t0 + n × period`. A short timer loop wakes ~every 10–15 ms, fires any due click with `play()`, and never chains intervals, so errors don't accumulate. | No drift over time, but each click can be early/late by **jitter of roughly 5–20 ms**, more if the JS thread is busy (navigation, big re-render, Firestore sync). A busy JS thread for 100 ms means one late click; the next one is on time again. | Small |
| **B. expo-audio + pre-rendered bar loop** | Generate the clicks for N bars as one WAV file in TypeScript (PCM samples), save it with `expo-file-system`, play it with `loop`. The audio hardware plays clicks sample-accurately; JS isn't involved in timing. | Clicks inside the buffer are exact, even with a busy JS thread. Risks: a small gap at the loop seam (platform-dependent), and every tempo/sound change needs a new file (~50–100 ms delay). Pendulum follows `player.currentTime`. | Medium |
| **C. react-native-audio-api** | Web-Audio-style scheduler (`source.start(when)`), sample-accurate. | Best, but **doesn't run in Expo Go**: dev build only. | Later |

**Recommendation: A now, behind `MetronomeEngine`, with a measurement step (4.1).** It's the simplest to understand and defend, works in Expo Go, and has no drift. Step 4.1 logs planned vs actual click times on the iPhone; if jitter is clearly audible, we switch to B (same interface). C replaces both in the Android dev build later.

How the pendulum stays in sync (the click is the master clock): the engine emits a `tick` event **when it actually fires each click** (with its beat index and time). On every tick the pendulum shared value is restarted toward the opposite end (−25° ↔ +25°) with a sine ease lasting exactly one beat period, running on the UI thread with Reanimated. Because each swing is re-anchored to a real click, the pendulum can never drift away from the sound; at worst it shows the same jitter as the click. With reduced motion, ticks only light the lamps.

Planned interface (`src/audio/metronome/MetronomeEngine.ts`):

```ts
export type TimeSignature = '4/4' | '3/4' | '2/4' | '6/8';
export type Subdivision = 'quarter' | 'eighth' | 'sixteenth';
export type ClickSound = 'click' | 'woodblock' | 'hihat';

export interface MetronomeConfig {
  bpm: number;              // 40–240
  timeSignature: TimeSignature;
  subdivision: Subdivision;
  sound: ClickSound;
}

export interface Tick {
  bar: number;              // 0-based bar count since start
  beat: number;             // 0-based beat in the bar (0 = accented beat 1)
  sub: number;              // 0 = on the beat, >0 = subdivision click
  time: number;             // engine clock (ms) when the click was played
}

export interface MetronomeEngine {
  load(): Promise<void>;                     // preload sounds
  start(config: MetronomeConfig): void;
  update(config: Partial<MetronomeConfig>): void; // applied from the next beat
  stop(): void;
  onTick(listener: (tick: Tick) => void): () => void; // returns unsubscribe
  now(): number;                             // the engine's clock (ms)
  dispose(): void;
}
```

The speed trainer and the Practice highway (which reads `currentBeat` from the scheduler) sit on top of this interface, so they work unchanged with a dev-build engine.

Background: **the metronome stops when the app goes to the background or the screen locks** (decided 2026-10-26). So no background-audio mode is needed.
Sounds: Click, Woodblock, Hi-hat. The fourth segment "Option 4" in the design is the component kit's placeholder and is left out.

### D2. Chord data

| Option | Pros | Cons |
|---|---|---|
| **A. Hand-written TypeScript** | Fully understood and defensible; exactly the 18 shapes and voicing labels in the design ("fr 3 · root on A") | Typing work; risk of mistakes (tests catch them) |
| **B. Open dataset `tombatossals/chords-db`** (MIT licence, verified) | Thousands of voicings ready | Its naming/suffixes and voicings don't match the design's 18 shapes; big; must be mapped and trimmed anyway |
| **C. Generated from rules** | Movable shapes ("root on E", "root on A") are templates; one template per shape × 12 roots gives all voicings | Open-position voicings for quick chords still hand-written |

**Recommendation: A + C.** A small hand-written table of **shape templates** (formula + root-on-E and root-on-A fingering for each of the 18 shapes in the design) generates every voicing for all 12 roots, plus a hand-written list of **open voicings** for the 11 quick chords (C G D Am Em E7 Dm7 F Bm Cmaj7 E♭). The chord **naming** in Chord Lab (any fingers you place) is a pure function: notes → intervals → match against the same 18 formulas. Unit tests check that every generated voicing is named back correctly.
v1 chords = exactly what the design shows: 12 roots × 18 shapes (Basic 4, Sevenths 4, Suspended and added 5, Diminished/augmented/altered 5), 1–2 voicings each.

### D3. Chord (and metronome) sounds

| Option | Asset size | Licence | Notes |
|---|---|---|---|
| A. One sample per chord | huge (12 × 18 × voicings) | — | Impossible for a free-form fretboard. Rejected |
| **B. Per-note samples, strummed with small delays** | ~37 notes (E2–E5) × ~40 KB (2 s mono AAC) ≈ **1.5 MB**; or every 3rd note + `setPlaybackRate` pitch-shift ≈ 0.5 MB | Record my own guitar (cleanest: my licence, nice for the thesis), or FluidR3 GM steel-guitar samples (MIT upstream, but the popular `midi-js-soundfonts` package labels them CC BY 3.0: needs attribution) | Realistic. Strum = 6 players started 15–25 ms apart (jitter is fine for a strum) |
| **C. Synthesis (Karplus–Strong) rendered to a WAV in TypeScript** | 0 MB | none needed | Pure TS (fits `src/audio/dsp/` style, testable, explainable); the whole strum is rendered into **one** buffer, so the strum timing is exact. Sounds "plucky", less like a real guitar |

**Recommendation: C first, B as an upgrade.** C has no licence or asset risk and is a strong thesis topic; if it sounds too synthetic on the iPhone, record ~13 notes from my own guitar and switch to B behind the same `ChordPlayer` interface.
Metronome sounds (Click, Woodblock, Hi-hat, each with an accent version): synthesise them the same way (short filtered noise / tuned decay) or use CC0 samples from freesound.org (< 50 KB total). Recommendation: synthesise; CC0 samples if it sounds bad.
Both need `expo-file-system` (in Expo Go) to write generated WAV files.

### D4. Chord diagrams and fretboards

| Option | Notes |
|---|---|
| **A. React Native Views + `expo-image` wood texture (+ `react-native-svg` for thin lines/dots if needed)** | Chord Lab's fretboard is a grid of 44 pt tap targets, so `Pressable` cells are natural, accessible (each cell gets a label like "A string, fret 3") and simple. `react-native-svg` is in Expo Go |
| B. `@shopify/react-native-skia` | In Expo Go (2.6.2), great for shaders/effects, but adds a few MB, custom hit-testing for taps, harder accessibility |

**Recommendation: A.** Skia buys nothing here; the wood is a baked texture.

### D5. Instrument rendering (Tuner, Metronome)

| Option | Notes |
|---|---|
| **A. Baked images exported from the `.pen` file + Reanimated transforms** | Exactly what the layer specs in the design say: static body PNG/WebP @2x/@3x, ≤ 3 moving layers (strobe ring rotation, pendulum rotation + weight translate, lamp opacity), glass overlay on top. Every animation is a transform/opacity on the UI thread, which is cheap |
| B. Draw them with Skia | Resolution-independent, but re-implementing wood, brass and enamel gradients by hand is a lot of work and slower to render |

**Recommendation: A** (matches `docs/decisions.md` performance rules 4 and 5).

How the design becomes code: pen.dev components can't be used in React Native directly. What we take from pen.dev is **pictures**: each layer frame is exported as a PNG and shown with `expo-image`; React Native code then rotates/fades those pictures.
- Exported from pen.dev: Tuner static-body and glass-overlay; Metronome static-body, pendulum (rod + hub), weight, glass-overlay.
- **Drawn in code with `react-native-svg`** (decided 2026-10-26): the Tuner's moving parts, i.e. the lit strobe ring (3 rings of segments), the LOCK and AUTO lamps and the flat/sharp arrows. They are simple shapes (circles, arcs, triangles), and drawing them avoids having to add new frames to the design just for export. Colours come from the theme (`strobe-glow`, `green`, `amber`).

### D6. Auth gating

Current Expo Router pattern (docs, SDK 57): a session context provider + `useSession()` hook, a splash-screen controller that keeps the splash visible until the auth state is known, and `<Stack.Protected guard={…}>` around route groups in the root `_layout.tsx`.

Plan:
- `src/firebase/AuthProvider.tsx`: subscribes to `onAuthStateChanged`, exposes `{ user, isLoading, signIn, signUp, resetPassword, signOut }` via context; `useAuth()` hook.
- Root layout: `<Stack.Protected guard={!user}>` → `(auth)` group; `<Stack.Protected guard={!!user && !onboarded}>` → `onboarding`; `<Stack.Protected guard={!!user && onboarded}>` → `(tabs)` and the pushed screens.
- No tokens are stored by us: Firebase Auth persists the session in AsyncStorage itself. (The docs' example uses `expo-secure-store` because it stores its own token; we don't need it.)

Alternative: redirect inside each layout with `<Redirect>` (older pattern, more code, flashes). **Recommendation: `Stack.Protected`.**

### D7. Firebase migration

Steps (2.1): move `src/lib/firebase.ts` → `src/firebase/config.ts`; add `initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) })` (guarded so fast refresh doesn't call it twice); install AsyncStorage; fail with a clear message if an env variable is missing; add `.env.example`. Firestore on React Native uses a memory cache (no IndexedDB), so offline writes survive only while the app is open (see risk R5).

### D8. Security rules deployment

| Option | Notes |
|---|---|
| **A. `firestore.rules` in the repo, deployed with the Firebase CLI** (`npx firebase-tools deploy --only firestore:rules`) | Versioned with the code (thesis evidence), repeatable, can be tested with the emulator later |
| B. Paste into the console | No tooling, but the repo and the live rules drift apart |

**Recommendation: A**, deployed in step 2.2 (before sign-up needs Firestore; the current rules lock everything). Every deploy only with your OK.

### D9. Gamification rules (values from the design where they exist)

From the design:
- Ranks: **Bedroom Player** Lv 1–4, **Garage Band** Lv 5–8, **Opening Act** Lv 9–12, **Headliner** Lv 13+.
- New user: "0 / 100 XP to level 2". Level 4 user: "1,240 / 1,600 XP to level 5".
- Lesson run XP: **+120** (personal best), **+80** (normal), **+40** (rough; "You still earned XP for showing up").
- Daily goal: 5 / 10 / 15 / 20 min (default 15); "Hitting it each day keeps your streak going."
- Achievements shown: 7-day streak, Perfect pitch run, 120 BPM club, First 100%, 30-day streak, Barre chord boss ("4 of 12").

Proposal (accepted 2026-10-26 as the starting point; values can be tuned later, every change goes into decisions.md):
- **Level curve:** total XP needed for level *n* = 100 × (n − 1)². Level 2 = 100, 3 = 400, 4 = 900, 5 = 1,600, 9 = 6,400, 13 = 14,400. It matches both numbers in the design.
- **Lesson run:** 40 for finishing + 40 if score ≥ 50 % + 40 if personal best (gives 40 / 80 / 120). Mock runs give nothing unless the dev flag is on.
- **Metronome:** 5 XP per full minute played, max 60 XP per day.
- **Chord Lab:** 2 XP per *different* chord strummed, max 30 XP per day.
- **Practice time** for the daily goal: metronome playing time + lesson run time + Chord Lab active time (a minute counts if you strummed or placed a finger in it).
- **Streak day:** a calendar day in the phone's **local time zone** where practice time ≥ the daily goal. The streak counts consecutive such days; it is not broken until a whole local day passes without meeting the goal (so "12 day streak" still shows during today before practising). Time zone is saved with each day; travelling can't erase a day already recorded.
- **Achievements ("Pick collection", 12):** confirmed 2026-10-26. The first 6 are in the design (name and glyph); conditions are mine. ⓜ = needs scored lesson runs, so it can only be earned with mock runs (dev flag) until the mic works.

| # | Name | Glyph | Condition |
|---|---|---|---|
| 1 | 7-day streak | 7 | reach a 7-day streak |
| 2 | Perfect pitch run ⓜ | ±0 | a lesson run where every clean note is within ±5 cents |
| 3 | 120 BPM club | 120 | play the metronome at 120 BPM or faster for one full minute, or finish a lesson run at ≥ 120 BPM |
| 4 | First 100% ⓜ | 100 | score 100 % on a lesson run |
| 5 | 30-day streak | 30 | reach a 30-day streak |
| 6 | Barre chord boss | F | strum 5 different barre-chord voicings in Chord Lab |
| 7 | First session | 1 | finish your first practice session (any tool) |
| 8 | 3-day streak | 3 | reach a 3-day streak |
| 9 | Garage Band | 5 | reach level 5 |
| 10 | Chord explorer | 20 | strum 20 different chords in Chord Lab |
| 11 | Steady hands | 60 | 60 minutes of metronome practice in total |
| 12 | Tempo climber | ↑ | finish a speed-trainer run that reaches its goal tempo |

Names 7–12 and all glyphs for them are not in the design; the "not earned" badge style is (dashed outline, dim).

### D10. Fonts

Archivo (400/500/600), DM Mono (400/500), Barlow Semi Condensed (500/600) via `@expo-google-fonts/archivo`, `@expo-google-fonts/dm-mono`, `@expo-google-fonts/barlow-semi-condensed` (JS packages containing the font files, OFL licence), loaded with **`useFonts`** in the root layout while the splash screen stays visible. The `expo-font` config plugin is the "recommended" method in the docs, but it **doesn't work in Expo Go**, so it waits for the dev build. Michroma is not needed.

### D11. Template cleanup

**Recommendation:** in Phase 0 delete the template images (`expo-badge*`, `expo-logo`, `logo-glow`, `react-logo*`, `tutorial-web`, `tabIcons/`), the broken `reset-project` script entry, the `example/` folder (it's git-ignored, only on disk), and the template README text; set `userInterfaceStyle: "dark"` and splash/background colours to `color.bg`. Keep the placeholder app icons until a real icon exists. Unused packages (`expo-symbols`, `expo-glass-effect`, `@expo/ui`, `expo-web-browser`, `expo-device`, web packages) can be removed with `npm uninstall` in Phase 0 or kept; removing is cleaner for the thesis ("every dependency has a reason"). **Chosen 2026-10-26: remove them in step 0.1.**

### D12. Tests for pure logic (extra)

Chord naming, level/streak rules and the metronome scheduler math are pure functions and easy to get subtly wrong. Option: add `jest-expo` + `jest` (dev dependencies only; no effect on Expo Go) and unit-test `src/audio/dsp/`, `src/music/`, `src/gamification/`. Alternative: no tests, verify by hand. **Recommendation: add jest-expo in Phase 0**; tests are also good thesis evidence. **Chosen 2026-10-26.**

### D13. Google sign-in

The design has "Continue with Google" (Sign in) and "Sign up with Google" (Sign up).

Facts (Expo docs, checked 2026-10-26): Google sign-in on mobile needs a native library (`@react-native-google-signin/google-signin` or `react-native-nitro-google-signin`) with a config plugin, so it **does not work in Expo Go** and needs a development build. For Android it also needs the app's SHA-1 certificate fingerprint registered in Firebase/Google Cloud. iOS would need an iOS dev build, which isn't possible here (no Mac, no Apple Developer account).

| Option | Notes |
|---|---|
| **A. Hide the Google buttons for now; add Google sign-in in the Android dev-build phase** | Nothing to set up now; email + password works everywhere. The buttons appear only where Google sign-in can actually work (Android dev build); in Expo Go they stay hidden |
| B. Show the buttons now, disabled / "coming soon" | Matches the design visually, but shows a feature that doesn't work |
| C. Web OAuth flow with `expo-auth-session` in Expo Go | Google no longer accepts Expo Go's redirect URLs for this; not supported by the current Expo docs |

**Chosen 2026-10-26: A.** Don't enable the Google provider in the Firebase console yet; it's done in step A.1 together with the SHA-1 fingerprint.

### D14. Lesson content

Decided 2026-10-26: the mic doesn't work yet, so only a little playable content is needed.
- `src/data/lessons.ts` holds all **12 lessons from the design** as metadata (title, category, tempo, goal tempo, unlock rule), so Learn, Today and You look exactly like the design.
- **3 lessons get full exercise content** (the notes for the Practice highway and the shape for Lesson detail): "Quarter notes on the click" (rhythm), "Chromatic warm-up 1-2-3-4" (scales), "E minor pentatonic, box 1" (scales; the lesson used in the Lesson detail and Results designs).
- The other 9 open Lesson detail with their shape where it's simple, and "Play" shows a short "coming soon" note (copy to approve). More content is added after the mic works.

---

## 3. Phases and steps

Conventions for every step:
- **Test device:** "iPhone" = iPhone in Expo Go (`npx expo start`, scan QR). Android emulator is optional and mentioned only where it helps.
- **Done when** always includes: `npx tsc --noEmit` and `npx expo lint` pass, the app opens in Expo Go without red/yellow boxes.
- New libraries are installed with `npx expo install` and only after your OK.

### Phase U: SDK upgrade (floating, do it when it's needed)

- [x] **U.1 Upgrade to SDK 58** when the App Store Expo Go updates to SDK 58. (done 2026-10-26: Expo Go on the iPhone updated and refused the SDK 57 project. `npx expo install expo@^58.0.0 --fix` failed with an npm peer conflict between the old and new reanimated/worklets, so `package.json` was set to the SDK 58 versions and `node_modules` + `package-lock.json` were reinstalled clean. tsc, lint and an iOS bundle export pass; expo-doctor 19/20, only R12.)
  - Files: `package.json`, `package-lock.json`, possibly `app.json`; follow the official upgrade guide (`npx expo install expo@^58 --fix`, `npx expo-doctor`).
  - Libraries: version bumps only.
  - Test: iPhone with the updated Expo Go; open every finished screen.
  - Done when: expo-doctor clean; all screens work; RN 0.88 strict TS types fixed.
  - Docs: decisions (upgrade date + notable breaking changes).
  - Commit: `chore: upgrade to Expo SDK 58`

### Phase 0: Foundation

- [x] **0.1 Template cleanup and app config** (done 2026-10-26)
  - Goal: remove template leftovers so only GuitarLab code remains.
  - Files: delete template images and `example/`; `package.json` (scripts; uninstall `expo-symbols`, `expo-glass-effect`, `@expo/ui`, `expo-web-browser`, `expo-device`, `react-native-web`, `react-dom` per D11); `app.json` (dark UI, colours, name); `README.md` (short project README); `.vscode/settings.json` (drop `sortMembers`).
  - Libraries: none (maybe removals, see D11).
  - Test: iPhone: the app opens and shows the "GuitarLab" placeholder. (The screen itself stays light until the theme is applied in 1.1; `app.json` dark settings only affect real builds.)
  - Done when: no template assets/scripts left; `npx expo-doctor` passes.
  - Result: done. Also updated Expo packages to the latest SDK 57 patch versions (`npx expo install --fix`) and regenerated `package-lock.json` from scratch. `npx expo-doctor`: 20/21 checks pass. The remaining one is a pre-existing duplicate of `@expo/log-box` / `@expo/dom-webview` inside Expo's own packages (same version twice; npm can't merge them because of a peer conflict). It doesn't affect Expo Go; see risk R12.
  - Docs: decisions (cleanup).
  - Commit: `chore: remove Expo template leftovers`
- [x] **0.2 Folder structure, env and checks** (done 2026-10-26)
  - Goal: the folder layout from `CLAUDE.md` plus a working check routine.
  - Files: `src/{components,theme,audio,firebase,hooks,data,types}/` (with short `README` or index files), `.env.example`, `package.json` scripts `typecheck`, `lint`, (`test` if D12).
  - Libraries: `jest-expo`, `jest`, `@types/jest` (dev only; Expo Go not affected) if D12 is approved.
  - Test: run `npm run typecheck`, `npm run lint` (and `npm test` with one sample test).
  - Done when: all three commands pass on Windows PowerShell.
  - Result: done. Folders have a short README each; `.env.example`; scripts `typecheck`, `lint`, `test`, `test:watch`; Jest config `preset: jest-expo`; first test `__tests__/env-example-test.ts` checks that `.env.example` lists exactly the keys the Firebase config reads. TypeScript 6 no longer loads installed type packages automatically, so `tsconfig.json` sets `"types": ["jest"]`; the test file loads Node types itself. Found that the global npm is 7.24.2 (old); it nested Expo packages wrongly (the cause of R12 and of "Cannot find module expo-modules-core" in Jest). Reinstalled with npm 10 (`npx npm@10 install`) and added an npm `overrides` entry pinning the optional `react-dom` to React's version. expo-doctor now 20/20.
  - Docs: features (foundation), decisions (tests).
  - Commit: `chore: project structure, env example and check scripts`

### Phase 1: Theme and base components

- [x] **1.1 Tokens and fonts** (done 2026-10-26)
  - Goal: `src/theme/` mirrors the `.pen` variables; fonts load before the first screen.
  - Files: `src/theme/{colors,spacing,radii,typography,index}.ts`, `src/app/_layout.tsx` (load fonts, keep splash).
  - Libraries: `@expo-google-fonts/archivo`, `@expo-google-fonts/dm-mono`, `@expo-google-fonts/barlow-semi-condensed` (Expo Go: yes, JS + `expo-font`).
  - Test: iPhone: a temporary screen shows sample text in all 3 fonts.
  - Done when: every token from `docs/design-map.md` §3 exists; text styles (title, body, label, readout…) defined from the kit's text nodes.
  - Docs: design-map (token names confirmed).
  - Commit: `feat(theme): design tokens and fonts from the .pen file`
  - Result: done. `src/theme/` has all 67 `color.*` variables, space, radii, type sizes, font families and 28 named text styles taken from the text nodes the screens use. Fonts load per weight from subpaths (`@expo-google-fonts/archivo/600SemiBold`), so only the 6 files the design uses are bundled (~560 KB). The root layout keeps the splash screen until fonts are ready, hides the header and sets `color.bg`. `src/app/index.tsx` is a temporary font check. New test `__tests__/theme-tokens-test.ts` compares every token with the `.pen` variables.
- [x] **1.2 Layout class, text and screen wrapper** (done 2026-10-26)
  - Goal: `useLayoutClass()` (compact/regular/wide) and the base `AppText` / `Screen` components.
  - Files: `src/hooks/useLayoutClass.ts`, `src/components/AppText.tsx`, `src/components/Screen.tsx` (safe areas, background, optional scroll, max width on wide).
  - Libraries: none.
  - Test: iPhone (regular); Android emulator 360×640 for compact (optional).
  - Done when: hook returns the right class; text scales with system font size.
  - Commit: `feat(ui): layout classes, text and screen wrapper`
  - Result: done. Rules in `src/theme/layout.ts` (`getLayoutClass`, unit-tested with 9 sizes): wide when the short side ≥ 600; compact when the long side < 700 or the short side < 360; otherwise regular. Using short/long sides keeps the class the same in landscape. The test iPhone is 375 × 667 pt (iPhone SE/8 class), so it shows the **compact** layouts; regular layouts need a bigger phone or the Android emulator. `Screen` uses the design's screen margins (16 sides, 8 top, 24 bottom) and a `gap` prop; on wide screens content is centred at max 480 pt.
- [x] **1.3 Buttons, icon button, text fields** (done 2026-10-26)
  - Files: `src/components/{Button,IconButton,TextField,PasswordField,Icon}.tsx`.
  - Libraries: `lucide-react-native` (+ `react-native-svg`); Expo Go: yes (react-native-svg is in Expo Go).
  - Test: iPhone via the gallery route (1.5) or a temp screen: pressed/disabled/error states, 44 pt targets, VoiceOver labels.
  - Done when: matches the kit's Buttons and Inputs sections.
  - Commit: `feat(ui): buttons and text fields`
  - Result: done. `Icon` imports each Lucide icon the design uses on its own (`lucide-react-native/icons/play`), 44 icons under the design's names ("music" maps to Lucide's renamed "eighth-notes"). `Button` (primary / secondary / ghost, default / pressed / disabled, optional icon, `fullWidth`), `IconButton` (44 × 44, required accessibility label), `TextField` (label row with optional accessory, focused amber border, error with icon, helper or green success line, `trailing` and `footer` slots), `PasswordField` (Show / Hide text button as on the Sign in / Sign up screens). New text style `helper14`. iOS bundle 2.5 → 2.8 MB. The check screen in `src/app/index.tsx` shows all of them. Testing on the iPhone SE showed the keyboard covering a focused field; fixed in `Screen` with the scroll view's `automaticallyAdjustKeyboardInsets` (iOS), see R15.
- [x] **1.4 Content and control components** (done 2026-10-26)
  - Files: `Card`, `ListRow`, `SectionHeader`, `Tag`, `StatTile`, `ProgressBar`, `Switch`, `SegmentedControl`, `ToolSwitch`, `StreakStrip`.
  - Libraries: none.
  - Test: iPhone gallery.
  - Commit: `feat(ui): content and control components`
  - Result: done. All 10 components follow the kit (sizes, colours, states read with `inspect-pen.js props`). `StreakStrip` supports both the kit's compact strip and the Today screen's version (big count, last 7 days, daily-goal ring drawn with `react-native-svg`). `SegmentedControl` takes per-option label styles (DM Mono for "4/4"); the note glyphs ♩ ♫ ♬ need the **Noto Music** font named in the kit note, to be added in step 4.2. `Switch` slides its knob with Reanimated and respects Reduce Motion; the bundle grew 2.8 → 3.9 MB because Reanimated is now used for the first time. New text style `monoStrong32`. `ListRow` has a pressed state (surface colour) that the kit doesn't define.
- [x] **1.5 Navigation, overlays, states + dev gallery** (done 2026-10-26; Phase 1 complete)
  - Files: `TabBar`, `ScreenHeader`, `Toast`, `Dialog`, `BottomSheet`, `Skeleton`, `EmptyState`, `ErrorState`, `ListeningIndicator`; `src/app/dev/gallery.tsx` (only reachable when `__DEV__`).
  - Libraries: none (BottomSheet built with Reanimated + gesture handler, both installed).
  - Test: iPhone: open `/dev/gallery`, compare with `docs/design/screens/Components.png`.
  - Done when: all 25 kit components exist; reduced motion disables sheet/toast animations.
  - Docs: features.
  - Commit: `feat(ui): overlays, states and a dev component gallery`
  - Result: done. `TabBar` (5 tabs, amber LED, bottom safe area instead of a fixed 34 pt; connected to Expo Router in 3.1), `ScreenHeader` (tool / back variants with a trailing slot), `ListeningIndicator` (green dot + 6 level bars), `Toast` (inline banner with optional detail line and action), `Dialog` and `BottomSheet` (React Native `Modal`; the sheet slides up with a Reanimated entering animation, no drag-to-close yet), `SkeletonCard` / `SkeletonListRow` (opacity pulse), `EmptyState` / `ErrorState` (in `StateMessage.tsx`). Reduce Motion turns off the dialog fade, sheet slide, skeleton pulse and switch slide. The check screen moved to `src/app/dev/gallery.tsx` (redirects home outside development); `src/app/index.tsx` is a placeholder with a dev-only link to it. New text style `message14`.

### Phase 2: Firebase and auth

- [x] **2.1 Firebase config migration + Auth persistence** (done 2026-10-26)
  - Goal: one `src/firebase/config.ts` exporting `app`, `auth`, `db`.
  - Files: `src/firebase/config.ts` (from `src/lib/firebase.ts`, then delete `src/lib/`), `.env.example`.
  - Libraries: `@react-native-async-storage/async-storage` (Expo Go: yes).
  - Test: iPhone: temporary log shows `auth state: signed out` without warnings about missing persistence.
  - Done when: no "already initialized" error on fast refresh; TS types for `getReactNativePersistence` resolved.
  - Docs: decisions (migration), data-model (none yet).
  - Commit: `refactor(firebase): move config to src/firebase and add auth persistence`
  - Result: done. `src/firebase/config.ts` exports `app`, `auth` (with AsyncStorage persistence) and `db`; it throws a clear error if an env value is missing and reuses the existing app/auth on fast refresh. `src/lib/` deleted; the env test now reads the new file. The TS error appeared as expected and is fixed by a one-function declaration file. The iOS bundle contains only the React Native build of Firebase Auth. Bundle 3.9 → 5.6 MB (Firebase Auth + Firestore). The home placeholder shows the auth state. AsyncStorage chosen over `expo-sqlite/localStorage`: Expo's SDK 58 docs and Firebase guide still use AsyncStorage and don't mark it deprecated.
- [x] **2.2 First security rules, deployed with the CLI** (done 2026-10-26)
  - Goal: deploy our first rules. The database is in production mode (everything denied), so the app can't use Firestore until this is done.
  - Files: `firebase.json`, `.firebaserc`, `firestore.rules` (draft from `docs/data-model.md`), `firestore.indexes.json`.
  - Libraries: none in the app; Firebase CLI via `npx firebase-tools` (dev tool on Windows; needs `npx firebase-tools login` by you).
  - Test: Firebase console → Firestore → Rules → **Rules Playground**: signed-in user A can read `users/A`, cannot read `users/B`; unauthenticated read is denied.
  - Done when: rules deployed (**only after your OK**) and playground checks pass.
  - Docs: data-model (rules section), decisions (CLI deployment).
  - Commit: `feat(firebase): firestore security rules`
  - Result: done. Rules: owner-only access to `users/{uid}` and everything under it; create needs a 1–40 character `displayName` and a server-time `createdAt`; update can't change `createdAt`; everything else denied. Compiled with `--dry-run`, then deployed on 2026-10-26 with your OK (`npx firebase-tools deploy --only firestore:rules`). The CLI was already logged in. Rules Playground (console) checked by you on 2026-10-26: own profile read allowed, other user denied, signed out denied.
- [x] **2.3 Auth provider and gated navigation** (done 2026-10-26)
  - Files: `src/firebase/AuthProvider.tsx`, `src/hooks/useAuth.ts`, `src/app/_layout.tsx`, `src/app/(auth)/_layout.tsx`, `src/app/(app)/_layout.tsx`, a placeholder home with "Sign out".
  - Libraries: none.
  - Test: iPhone: signed out → sign-in placeholder; after sign-in (test user created in the console) → home; kill and reopen the app → still signed in.
  - Done when: no flash of the wrong screen (splash stays until auth is known).
  - Commit: `feat(auth): auth context and protected routes`
  - Result: done. `AuthProvider` keeps the Firebase user in React state via `onAuthStateChanged` and offers `signIn` / `signOut`; `useAuth()` reads it (React 19 `use`). The root layout keeps the splash until fonts and the restored sign-in are ready, then `Stack.Protected` shows either the `(app)` group (signed in) or the `(auth)` group (signed out). Screens never navigate after sign-in/out themselves; the guards do it. `(auth)/sign-in.tsx` is a temporary test form (Firebase's raw error messages) until 2.4; `(app)/index.tsx` is a placeholder home with "Sign out". The dev gallery stays outside both groups. See R16 for a typed-routes glitch. First iPhone test showed "Unmatched Route" when opening the app signed out: the blocked `/` fell back to the `(auth)` group, which has no `/`. Fixed with SDK 58's `redirectTo` on both guards (`/sign-in` and `/`).
- [x] **2.4 Sign in + forgot password** (done 2026-10-26)
  - Files: `src/app/(auth)/sign-in.tsx`, `src/firebase/authErrors.ts` (Firebase error code → friendly copy). Google buttons hidden (D13).
  - Test: iPhone: wrong password, unknown email, invalid email, no network (airplane mode), reset email arrives.
  - Done when: matches `Sign in / regular / default` and `/ forgot-password`; errors use approved copy.
  - Commit: `feat(auth): sign in and password reset`
  - Result: done 2026-10-26; error copy approved; tested on the iPhone (errors, forgot password with the email arriving, offline message, sign in). `sign-in.tsx` follows the design (hero behind the status bar, brand, flexible space, form, Sign in); `SignInHero` rebuilds the hero from the WebP photo (`scripts/assets/make-hero.py`: 1 MB JPEG → 162 KB WebP), a dark layer, frets and strings as views and an SVG fade; `LinkButton` for "Forgot password?"; `TextField` got `inputRef` so the keyboard's "Next" jumps to Password; `authErrors.ts` maps Firebase codes to a message and a field (unit-tested). "New here? Create an account" comes with Sign up in 2.5.
- [x] **2.5 Sign up + user document** (done 2026-10-26; Phase 2 complete)
  - Files: `src/app/(auth)/sign-up.tsx`, `src/firebase/users.ts` (create profile with defaults), `firestore.rules` update if needed.
  - Test: iPhone: create an account → `users/{uid}` appears in the console with default settings; email error on blur; live password rules.
  - Done when: matches `Sign up / regular / empty` and `/ email-error`; profile created exactly once.
  - Docs: data-model (confirm fields), features.
  - Commit: `feat(auth): sign up with user profile document`
  - Result: done 2026-10-26, tested on the iPhone. `sign-up.tsx` follows the design (back button, "Join the band", name / email / password, live rules, "Create account" at the bottom; Google and the divider hidden). Email is checked when the field loses focus; typing clears only that field's error. `AuthProvider.signUp` creates the account, sets its display name and writes `users/{uid}` via `src/firebase/users.ts` (defaults from the data model, server `createdAt`, phone time zone). `authValidation.ts` (email, password rules, name length) is unit-tested; 27 tests. Sign in links to Sign up. No rules change was needed. Copy: "That email already has an account. Sign in instead, or reset your password." (approved); "Enter a first name or nickname." (empty name, accepted with the commit). Changed on your request 2026-10-26: two extra password rules ("An uppercase letter", "A lowercase letter"; the design has only "8+ characters" and "A number"), the password is checked when leaving the field, the rules stay visible under the error, and the weak-password message is "Your password needs to meet all the rules below." See R17.

### Phase 3: Navigation shell and quiet-studio screens

- [x] **3.1 Tabs and tool switch** (done 2026-10-26)
  - Files: `src/app/(app)/(tabs)/_layout.tsx` (Expo Router `Tabs` with custom `TabBar`), placeholder `index`, `learn`, `tools/tuner`, `tools/metronome`, `chord-lab`, `you`.
  - Test: iPhone: all tabs, Tuner/Metronome switch, tab bar height 84 incl. home indicator.
  - Commit: `feat(nav): tab bar and tool switch`
  - Result: done, tested on the iPhone. `Tabs` from `expo-router/js-tabs` (SDK 58 path; the old `Tabs` export from `expo-router` is deprecated) with our `TabBar` passed as `tabBar`; a small adapter maps the router state to it and presses work like the default bar (`tabPress` event, then `navigateToTab`). Third tab renamed from the design's "Tuner" to **"Tools"** (audio-waveform icon) at your request, so the Metronome is findable; it is a `tools/` stack (tuner, metronome; no animation) switched by `ToolHeader` with `router.replace`. Screens without a tab bar in the design (Lesson detail, All chords, Settings, Results, Practice, Input check) go next to `(tabs)` in `(app)`, so routes for lesson detail and all chords moved there.
- [x] **3.2 Profile hook + Settings** (done 2026-10-26)
  - Files: `src/hooks/useProfile.ts` (live `onSnapshot`), `src/app/(app)/settings.tsx`, You header settings button.
  - Test: iPhone: change daily goal → value in the console changes; sign out works.
  - Done when: all Settings controls persist (Listening ones stored only).
  - Commit: `feat(settings): settings screen backed by the user profile`
  - Result: done, tested on the iPhone (changes saved to Firestore, Sign out). `ProfileProvider` (in `(app)/_layout.tsx`) keeps `users/{uid}` live with one `onSnapshot` listener; `useProfile()` reads it and `updateSettings` saves single fields (`settings.dailyGoalMin`). A missing profile is created by `ensureUserProfile` (a Firestore transaction, also used by sign-up), but only when the server, not the offline cache, says it is missing (fixes R17). Settings follows the design: Playing (hand, guitar, headstock, daily goal, A4 stepper 430–450), Listening (sensitivity slider, noise gate), Feedback (4 switch rows), Account (email, red Sign out). New components: `Slider` (React Native touch-responder props, no library; first version with PanResponder broke the React Compiler "no refs during render" lint rule), `SwitchRow` (whole row toggles), `Stepper`. Settings is opened from the You header; Sign out moved there from Today. "Run an input check" comes in 7.3. Loading = skeleton cards; error copy "Couldn't load your settings" / "Check your connection and try again." is not in the design (approved 2026-10-26).
- [ ] **3.3 Onboarding (level, guitar, microphone intro)**
  - Files: `src/app/(app)/onboarding/{_layout,level,guitar,microphone,low-e}.tsx` (low-e as a placeholder until 7.3), onboarding guard in root layout.
  - Test: iPhone: new account goes through onboarding; Skip works; existing account goes straight to Today.
  - Commit: `feat(onboarding): level and guitar setup`
- [ ] **3.4 Lessons data + Learn**
  - Files: `src/data/lessons.ts`, `src/types/lesson.ts`, `src/app/(app)/(tabs)/learn.tsx`.
  - Test: iPhone: filter chips, sections, locked row "How to unlock", loading and error states (forced via a dev toggle).
  - Commit: `feat(learn): lesson list with static content`
- [ ] **3.5 Lesson detail**
  - Files: `src/app/(app)/lesson/[lessonId].tsx` (outside the tabs: no tab bar in the design), `src/components/fretboard/ScaleShape.tsx`.
  - Test: iPhone: tempo segments change the Play button label; "Tune" opens the Tuner.
  - Commit: `feat(learn): lesson detail`
- [ ] **3.6 Today**
  - Files: `src/app/(app)/(tabs)/index.tsx`, `src/hooks/useNetworkStatus.ts`.
  - Libraries: maybe `@react-native-community/netinfo` (Expo Go: yes) for the offline banner. Ask first.
  - Test: iPhone: regular, first-day (new account), offline (airplane mode), loading.
  - Commit: `feat(today): today screen`
- [ ] **3.7 You (static progress)**
  - Files: `src/app/(app)/(tabs)/you.tsx`, `src/components/progress/{RankCard,AchievementGrid}.tsx`.
  - Test: iPhone: regular and empty states.
  - Commit: `feat(you): profile screen`

### Phase 4: Metronome

- [ ] **4.1 Engine + timing measurement**
  - Goal: `MetronomeEngine` interface and the expo-audio implementation (D1), plus a dev screen that logs click timing.
  - Files: `src/audio/metronome/{MetronomeEngine,ExpoAudioEngine,scheduler}.ts`, `src/audio/synth/` (if sounds are synthesised, D3), `assets/sounds/` (if samples), `src/app/dev/metronome-timing.tsx`.
  - Libraries: `expo-audio` (Expo Go: yes; has a config plugin, but only needed for background audio or recording in dev builds), `expo-file-system` (Expo Go: yes) if WAVs are generated.
  - Test: iPhone: 60, 120, 200 BPM for 2 min each; read jitter stats on screen; listen against a reference metronome app.
  - Done when: no drift after 5 minutes; jitter measured and written into decisions.md; scheduler math unit-tested.
  - Docs: decisions (engine choice with measured numbers).
  - Commit: `feat(metronome): drift-free click engine`
- [ ] **4.2 Metronome state and controls**
  - Files: `src/hooks/useMetronome.ts`, `src/app/(app)/(tabs)/tools/metronome.tsx`, `src/audio/metronome/tempoNames.ts`, TAP tempo helper.
  - Test: iPhone: ±1/±5 clamp to 40–240, TAP (4 taps), time signatures, subdivisions, sounds, Start/Stop.
  - Commit: `feat(metronome): controls and tempo state`
- [ ] **4.3 Pyramid instrument**
  - Files: `src/components/metronome/MetronomeInstrument.tsx`, `assets/instruments/metronome/*`.
  - Libraries: none (Reanimated, expo-image installed).
  - Test: iPhone: pendulum hits an end exactly on each click; weight slides with a short spring on BPM change; reduced motion (iOS Settings → Accessibility → Motion) keeps it still.
  - Commit: `feat(metronome): pyramid instrument with synced pendulum`
- [ ] **4.4 Beat lamps, edge flash, haptics, layouts**
  - Files: `BeatLamps.tsx`, `EdgeFlash.tsx`, compact layout + large-text rule (`fontScale ≥ 1.2` stacks rows).
  - Libraries: `expo-haptics` (Expo Go: yes) for "Feel the beat".
  - Test: iPhone: beat 1 amber and larger; flash off above 170 BPM / reduced motion / Visual pulse off; largest text size; Android emulator 360×640.
  - Commit: `feat(metronome): beat lamps, edge flash and haptics`
- [ ] **4.5 Speed trainer + histogram (mock)**
  - Files: `src/audio/metronome/speedTrainer.ts`, `TimingHistogram.tsx`, mock strum data in `src/audio/mock/`.
  - Test: iPhone: +2 BPM every 4 bars until the goal, "bar 5" text; histogram shows mock data with a "mock" marker in dev.
  - Done when: speed trainer logic unit-tested.
  - Docs: features (metronome done; histogram mock only).
  - Commit: `feat(metronome): speed trainer and timing histogram`

### Phase 5: Chord Lab

- [ ] **5.1 Music theory core**
  - Files: `src/music/{notes,intervals,chords,scales,spelling}.ts` + tests.
  - Test: `npm test` (every shape × 12 roots names back correctly; C x32010 → "C major", tones C 1 · E 3 · G 5; Cadd9 x35753).
  - Commit: `feat(music): chord naming and scale suggestions`
- [ ] **5.2 Chord shapes and voicings data**
  - Files: `src/data/chordShapes.ts`, `src/data/openChords.ts`.
  - Test: tests generate all voicings; spot-check fingerings on a real guitar.
  - Commit: `feat(chords): chord shapes and voicings`
- [ ] **5.3 Interactive fretboard and readout**
  - Files: `src/app/(app)/(tabs)/chord-lab.tsx`, `src/components/chordlab/{Fretboard,ChordReadout,QuickChords,TheoryCard}.tsx`, wood texture asset.
  - Test: iPhone: place/lift fingers, open/mute, move position, Clear → empty state, left-handed mirror (Settings), VoiceOver reads cells.
  - Commit: `feat(chordlab): interactive fretboard`
- [ ] **5.4 Strum sound**
  - Files: `src/audio/chords/{ChordPlayer,…}.ts` (synth or samples, D3).
  - Libraries: `expo-audio` (already added in 4.1).
  - Test: iPhone with the ring/silent switch on and off (should play in silent mode); quick repeated strums.
  - Commit: `feat(chordlab): strum sound`
- [ ] **5.5 All chords sheet**
  - Files: `src/app/(app)/all-chords.tsx`.
  - Test: iPhone: root picker, sections, tapping a voicing loads it and closes the sheet.
  - Docs: features (Chord Lab done).
  - Commit: `feat(chordlab): all chords sheet`

### Phase 6: Gamification wired to Firestore

- [ ] **6.1 Rules module**
  - Files: `src/gamification/{levels,xp,streak,achievements}.ts`, `src/data/achievements.ts` + tests.
  - Test: `npm test` (level 4 at 1,240 XP shows "1,240 / 1,600 XP to level 5"; streak across midnight and time zones).
  - Docs: decisions (final gamification rules), data-model.
  - Commit: `feat(gamification): xp, levels, streaks and achievements rules`
- [ ] **6.2 Session recording**
  - Files: `src/firebase/sessions.ts` (batched write: session + day + progress + achievements), `firestore.rules` validation.
  - Test: iPhone: finish a metronome session → documents appear in the console; airplane mode → retry later.
  - Commit: `feat(progress): save sessions and update progress`
- [ ] **6.3 Earn from Metronome and Chord Lab**
  - Files: `src/hooks/usePracticeTimer.ts` (pauses on app background), metronome and Chord Lab screens.
  - Test: iPhone: 5 minutes of metronome → +25 XP, daily goal bar moves.
  - Commit: `feat(progress): earn xp from metronome and chord lab`
- [ ] **6.4 Live Today and You**
  - Files: Today, You, Learn (lesson status from progress), level-up/achievement toasts.
  - Test: iPhone: new account → first-day; after practice → streak 1; level-up toast.
  - Docs: features.
  - Commit: `feat(progress): live progress on today and you`

### Phase 7: Mock audio layer and mic screens

- [ ] **7.1 AudioStream interface, mock, permission**
  - Files: `src/audio/{AudioStream,createAudioStream,MockAudioStream}.ts`, `src/audio/mock/scenarios.ts` (no signal → flat → in tune, noisy room, quiet…), `src/audio/permissions.ts`, `src/dev/flags.ts` (`SAVE_MOCK_SESSIONS`).
  - Libraries: none new (`expo-audio` has `requestRecordingPermissionsAsync`, works in Expo Go; the real stream library comes with the Android dev build later).
  - Test: iPhone: dev screen shows mock frames; Expo Go detection picks the mock.
  - Done when: no native audio library is imported anywhere outside the (future) real implementation.
  - Commit: `feat(audio): audio stream interface with mock implementation`
- [ ] **7.2 Tuner**
  - Files: `src/app/(app)/(tabs)/tools/tuner.tsx`, `src/components/tuner/{TunerInstrument,StrobeRing,TunerLamps,HeadstockSwitch,StringRow}.tsx` (strobe ring, lamps and arrows drawn with `react-native-svg`, D5), `assets/instruments/tuner/*` (static body + glass only).
  - Test: iPhone: all 5 instrument states from mock scenarios; strobe speed ∝ cents, frozen below ±4 ¢; AUTO/MANUAL footswitch; 3+3 / 6-in-line from Settings; compact layout.
  - Commit: `feat(tuner): strobe tuner driven by mock audio`
- [ ] **7.3 Input check + onboarding mic steps**
  - Files: `src/app/(app)/input-check.tsx`, onboarding `microphone.tsx` (real permission request), `low-e.tsx` (mock level).
  - Test: iPhone: deny permission in iOS Settings → "The mic is switched off"; mock quiet/noisy/fixed.
  - Commit: `feat(input): input check and microphone onboarding`
- [ ] **7.4 Practice run (landscape)**
  - Files: `src/app/(app)/practice.tsx`, `src/components/practice/{Highway,…}.tsx`, port of `design/scripts/practice-highway.js`.
  - Libraries: `expo-screen-orientation` (Expo Go: yes; locking orientation in a real build also needs `app.json` changes → new Android dev build later).
  - Test: iPhone: rotates to landscape, count-in, notes move linearly with the metronome clock, pause/quit dialog, K1–K10 states from a mock run.
  - Commit: `feat(practice): note highway driven by mock audio`
- [ ] **7.5 Results**
  - Files: `src/app/(app)/results.tsx`, coach text rules.
  - Test: iPhone: personal-best, normal, rough, save-failed (forced); mock run doesn't write unless the dev flag is on.
  - Commit: `feat(results): results screen`
- [ ] **7.6 Mock-driven progress widgets**
  - Files: histogram data source, You "Your mix" + accuracy chart.
  - Test: iPhone with the dev flag on and off.
  - Docs: features (mic features: mock only).
  - Commit: `feat(progress): mix and accuracy widgets`

### Phase 8: Polish

- [ ] **8.1 Accessibility pass**: VoiceOver on every screen, labels, focus order, contrast on wood/enamel, reduced motion. Test: iPhone with VoiceOver. Commit `fix(a11y): accessibility pass`
- [ ] **8.2 Large text and compact sizes**: largest system font size; Android emulator 360×640; iPhone. Commit `fix(ui): large text and compact layouts`
- [ ] **8.3 Performance check**: React DevTools profiler, Perf Monitor in Expo Go (note: Expo Go and dev mode are slower than a release build; real measurement waits for the Android dev build). Commit `perf: …`
- [ ] **8.4 Thesis docs**: update decisions, features, data-model; screenshots. Commit `docs: thesis documentation pass`

---

### Phase A: Android development build (later, when I have the Android phone)

Listed so nothing is forgotten; details are planned when the phone arrives. Each step needs a new Android dev build.

- [ ] **A.0 First Android dev build**: `expo-dev-client`, `eas.json` development profile, `npx eas-cli@latest build --profile development --platform android`.
- [ ] **A.1 Google sign-in (D13)**: native Google sign-in library + config plugin, SHA-1 fingerprint, enable the Google provider in Firebase (with step-by-step console instructions), show the Google buttons only in builds where it works.
- [ ] **A.2 Real microphone stream + DSP**: real `AudioStream` implementation, pitch detection in `src/audio/dsp/`.
- [ ] **A.3 Optional precise metronome engine** (`react-native-audio-api`) behind `MetronomeEngine`.
- [ ] **A.4 Fonts via the `expo-font` config plugin** and orientation config for Practice.

## 4. Risks

| # | Risk | If it happens |
|---|---|---|
| R1 | ~~App Store Expo Go switches to SDK 58 mid-project~~ (happened 2026-10-26, upgraded in U.1) | The same will happen with SDK 59 (~early 2027, possibly before February): keep dependencies minimal and do the upgrade as its own step. Avoid APIs removed in 58 (`InteractionManager`, `Touchable`, deep `react-native/Libraries` imports, `StatusBar` `backgroundColor`/`translucent`, `ImageBackground`) |
| R2 | ~~Firestore test-mode rules expire~~ (resolved 2026-10-25: the database is in production mode, locked) | Until step 2.2 every read/write fails with "permission denied"; this is expected |
| R3 | Metronome jitter in Expo Go is audible | Switch the engine to option B (pre-rendered loop); the dev-build engine (C) later |
| R4 | ~~`getReactNativePersistence` TypeScript error with firebase 13~~ (happened; fixed in 2.1 with `src/types/firebase-auth-react-native.d.ts`) | Remove the file if a future Firebase version ships the type itself (tsc will then report a duplicate) |
| R5 | Firestore JS SDK on React Native has only a memory cache, so writes made offline are lost if the app is closed before reconnecting | Results "save-failed" flow keeps unsent sessions in AsyncStorage and retries (design already has "kept on your phone and we'll retry") |
| R6 | ~~Moving tuner layers aren't in the design as separate frames~~ (resolved 2026-10-26: drawn in code with SVG, D5) | If the SVG strobe looks too flat next to the baked body, add a pre-rendered ring image later |
| R7 | Practice landscape doesn't lock on newer iOS (iOS 27 resizable apps) | Show a "rotate your phone" hint and lay out for whichever orientation is current |
| R8 | Chord Lab theory scope (18 shapes, naming, scales) takes longer than planned | v1 keeps naming + tones; "Also reads as" and "Scales that fit" can ship with a smaller list |
| R9 | Synthesised strum sounds too artificial | Record my own guitar samples (D3 option B) |
| R10 | Time runs short before February | Phases 0–6 are the core; Phase 7 screens can ship with fewer states |
| R11 | Expo Go login requirement or network blocks loading on the iPhone | `npx expo login` + login in Expo Go; try `npx expo start --tunnel` on school Wi-Fi |
| R12 | ~~expo-doctor warns about duplicate `@expo/log-box` / `@expo/dom-webview`~~ (resolved 2026-10-26: caused by the old global npm 7; reinstalled with npm 10) | — |
| R13 | ~~The old global npm 7 is still used~~ (resolved 2026-10-26: global npm updated to 10) by `npm install` and `npx expo install`, and would break `node_modules` again | Update the global npm once (manual task 10). Until then install with `npx npm@10 install` |
| R15 | Keyboard covers inputs on Android: `automaticallyAdjustKeyboardInsets` is iOS-only, and Expo's recommended `react-native-keyboard-controller` isn't in Expo Go | Check the auth screens on the Android emulator or the Android phone (step A.0). If fields are covered, wrap `Screen` in `KeyboardAvoidingView` on Android, or add `react-native-keyboard-controller` with the dev build |
| R16 | The running dev server's typed-routes generator can list new non-route files (e.g. `/../firebase/AuthProvider`) in `.expo/types/router.d.ts`, so `tsc` rejects valid links like `"/"` | Restart the dev server with `npx expo start --clear`; a fresh generation is correct (checked 2026-10-26) |
| R17 | ~~After `createUserWithEmailAndPassword` the user is signed in and the guard switches to the app before the profile document is written; if that write fails (e.g. connection lost), the account has no profile~~ (resolved in 3.2: `ProfileProvider` creates a missing profile) | Step 3.2's `useProfile` creates the profile when it is missing (name from the Firebase account) |
| R14 | The `react-dom` override must match React's version; after an SDK upgrade npm may fail with ERESOLVE again | On every SDK upgrade, set `overrides.react-dom` to the new `react` version |

---

## 5. Manual tasks for me

1. ~~Firebase console check~~ (done 2026-10-25).
2. ~~Enable Email/Password~~ (done 2026-10-25).
3. ~~**Firebase CLI login**~~ (already logged in as of 2026-10-26).
4. **Expo login** on PC (`npx expo login`) and in Expo Go on the iPhone (same account).
5. **PNG exports from pen.dev** into `docs/design/screens/` (@2x, names in `docs/design-map.md` §5). Before Phase 1 (components) and Phase 4 (metronome).
6. **Instrument layer exports** (@2x and @3x) into `assets/instruments/…` with the file names in `docs/design-map.md` §5: Metronome static-body, pendulum (with the weight hidden), weight, glass-overlay before step 4.3; Tuner static-body and glass-overlay before step 7.2. The tuner's moving parts are drawn in code, so no new frames are needed.
7. **Test accounts**: create one test user in Firebase Authentication (console → Users → Add user) for step 2.3.
8. **Check chord fingerings** on a real guitar in step 5.2.
9. **Upgrade check**: watch the App Store for an Expo Go update (next: SDK 59).
10. ~~**Update the global npm**~~ (done 2026-10-26, npm 10.x) (your PC still has npm 7.24.2 from 2021): run `npm install -g npm@10` in PowerShell, then check with `npm -v` (should print 10.x).

---

## 6. Open questions

Answered on 2026-10-26: Firebase console, Google sign-in (D13), auth error copy (Claude drafts it, you approve it in step 2.4), lesson content (D14), gamification starting values (D9), metronome background + sound options (D1), tuner layers (D5), template packages (D11), tests (D12), achievements list (D9), Chord Lab wood (reuse the walnut texture `design/generated-1.png`, step 5.3).

Still open:
1. **"Coming soon" copy** for lessons without full content (D14), drafted by Claude in step 3.5.

---

## 7. Changelog

- 2026-10-25: first draft (setup and planning session).
- 2026-10-25: Firebase audit completed (project/app confirmed, Email/Password on, location europe-central2, rules locked, not test mode); R2 resolved.
- 2026-10-26: decisions D1–D12 approved; added D13 (Google sign-in → Android dev build) and D14 (lesson content); tuner moving parts drawn in code; achievements proposal; Phase A added; open questions reduced to 3.
- 2026-10-26: achievements list confirmed; Chord Lab fretboard reuses the walnut texture instead of the Unsplash photo.
- 2026-10-26: step 0.1 done (template cleanup); added risk R12 (expo-doctor duplicate warning).
- 2026-10-26: step U.1 done (upgraded to SDK 58 because Expo Go on the iPhone updated); R1 updated for SDK 59.
- 2026-10-26: step 0.2 done (folders, .env.example, scripts, jest-expo); R12 resolved; added R13, R14 and manual task 10 (update global npm).
- 2026-10-26: global npm updated to 10 (manual task 10); R13 resolved.
- 2026-10-26: step 1.1 done (theme tokens, text styles, fonts).
- 2026-10-26: step 1.2 done (layout classes, AppText, Screen). Note: the test iPhone is compact class.
- 2026-10-26: step 1.3 done (Icon, Button, IconButton, TextField, PasswordField; added lucide-react-native + react-native-svg).
- 2026-10-26: keyboard fix in `Screen` after iPhone SE test; added R15 (Android keyboard).
- 2026-10-26: step 1.4 done (Card, ListRow, SectionHeader, Tag, StatTile, ProgressBar, StreakStrip, Switch, SegmentedControl, ToolSwitch).
- 2026-10-26: step 1.5 done; Phase 1 (theme and base components) complete.
- 2026-10-26: step 2.1 done (Firebase config in src/firebase, Auth persistence with AsyncStorage); R4 resolved.
- 2026-10-26: step 2.2 done: firestore.rules, firebase.json, .firebaserc, firestore.indexes.json; rules compiled (dry run) and deployed to guitarlab-25e83 with your OK.
- 2026-10-26: step 2.3 done (AuthProvider, useAuth, (auth)/(app) groups with Stack.Protected); added R16.
- 2026-10-26: step 2.4 built (Sign in screen, forgot password, error mapping); waiting for error copy approval and iPhone test.
- 2026-10-26: auth error copy approved.
- 2026-10-26: step 2.4 done (tested on iPhone).
- 2026-10-26: step 2.5 built (Sign up, profile document, validation); waiting for iPhone test; added R17.
- 2026-10-26: Sign up: four password rules, password checked on blur (your request).
- 2026-10-26: step 2.5 done; Phase 2 (Firebase and auth) complete. "Email already in use" stays a submit-time check (email enumeration protection).
- 2026-10-26: step 3.1 built (tabs, tool switch); route paths for lesson detail and all chords moved outside the tabs.
- 2026-10-26: third tab renamed "Tools" (design said "Tuner"), your choice among four options.
- 2026-10-26: step 3.2 built (ProfileProvider, Settings, Slider, SwitchRow, Stepper); R17 resolved.
- 2026-10-26: step 3.2 done (tested on iPhone).

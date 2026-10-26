# Features

Every feature from the design (`design/guitarlab.pen`, see `docs/design-map.md`) and its status.
Status values: **planned** · **in progress** · **mock only** (full UI, fake audio data) · **done** · **out of scope** (designed, not built now).
"Phase" refers to `docs/plan.md`.

Last updated: 2026-10-25 (nothing built yet; the app is still the Expo template).

## Foundation

| Feature | Phase | Status | Notes |
|---|---|---|---|
| Theme tokens from the `.pen` variables (colours, space, radii, type) | 1 | done | dark only, structured for a light theme later |
| Fonts: Archivo, DM Mono, Barlow Semi Condensed | 1 | done | `useFonts` at runtime (Expo Go) |
| Size classes compact / regular / wide + `useLayoutClass()` | 1 | done | rules in `src/theme/layout.ts` |
| Base text and screen wrapper (`AppText`, `Screen`) | 1 | done | safe areas, margins, max width on tablets |
| Icons, buttons, icon button, text and password fields | 1 | done | Lucide icons; states from the kit |
| Content and control components (card, list row, section header, tag, stat tile, XP bar, streak strip, switch, segmented control, tool switch) | 1 | done | |
| Base components (button, text field, card, list row, tab bar, …) | 1 | planned | 25 components from the kit |
| Dev-only component gallery route | 1 | planned | hidden in production |
| Folder structure, `.env.example`, check scripts | 0 | done | `npm run typecheck`, `npm run lint`, `npm test` |
| Unit tests (jest-expo) | 0 | done | first test checks `.env.example` |

## Account

| Feature | Phase | Status | Notes |
|---|---|---|---|
| Sign up with email + password (name, live password rules) | 2 | planned | |
| Sign in with email + password | 2 | planned | |
| Forgot password (reset email + "Reset link sent…" message) | 2 | planned | |
| Sign out (Settings → Account) | 2 | planned | |
| Auth-gated navigation | 2 | planned | `Stack.Protected` |
| User profile document created on sign-up | 2 | planned | `users/{uid}` |
| Friendly auth error messages | 2 | planned | design copy exists only for invalid email; rest needs approval |
| Sign in / up with Google | A.1 | planned (Android dev build) | not possible in Expo Go; buttons hidden until then |
| Offline banner on Today | 3 | planned | Firestore offline cache |

## Onboarding

| Feature | Phase | Status | Notes |
|---|---|---|---|
| Level picker (4 levels, skip) | 3 | planned | saved to profile |
| Guitar: acoustic/electric, strumming hand, headstock layout | 3 | planned | saved to settings |
| Microphone explanation screen ("Let us hear you") | 7 | planned | permission request is real; listening is mock |
| Pluck your low E (input level) | 7 | mock only | |

## Today, Learn, Lessons

| Feature | Phase | Status | Notes |
|---|---|---|---|
| Today: greeting, level badge, streak strip with daily goal, tonight's session card, up next | 3 → 6 | planned | static data in Phase 3, live in Phase 6 |
| Today: first-day, offline, loading states | 3 | planned | |
| Learn: lesson list with category filter and sections (in progress / up next / locked / done) | 3 | planned | static lessons from `src/data/` |
| Learn: loading and error states | 3 | planned | |
| Lesson unlock rule (≥ 80 % on the previous lesson) | 6 | planned | |
| Lesson detail: scale/riff shape on the fretboard, stats, tempo choice, tune-first nudge, Play | 3 | planned | Play opens Practice (mock) |
| Lesson content: 12 lessons as metadata, 3 with full exercises | 3 | planned | decision D14 |

## Tools

| Feature | Phase | Status | Notes |
|---|---|---|---|
| Tuner / Metronome switch | 4 | planned | |
| **Metronome**: pyramid instrument, swinging pendulum, sliding weight | 4 | planned | baked images + Reanimated |
| Metronome: BPM readout + tempo name, ±1 / ±5, TAP tempo | 4 | planned | 40–240 BPM |
| Metronome: time signatures 4/4, 3/4, 2/4, 6/8; subdivision ♩ ♫ ♬; sound choice | 4 | planned | |
| Metronome: play/stop, beat lamps with accented beat 1 | 4 | planned | |
| Metronome: speed trainer (+2 BPM every 4 bars up to the lesson goal) | 4 | planned | |
| Metronome: edge flash (off above 170 BPM, with reduced motion, or when Visual pulse is off) | 4 | planned | |
| Metronome: reduced motion (pendulum still, lamps only) | 4 | planned | |
| Metronome: "Feel the beat" haptics | 4 | planned | `expo-haptics`, from Settings |
| Metronome: "Your strums vs the click" histogram | 7 | mock only | |
| **Tuner**: strobe instrument, note/octave, cents, Hz, instruction text | 7 | mock only | |
| Tuner: AUTO / MANUAL string detection, headstock 3+3 and 6-in-line, compact string row | 7 | mock only | |
| Tuner: A4 reference | 7 | mock only | from Settings |
| **Chord Lab**: interactive fretboard (place fingers, open/mute strings, move position) | 5 | planned | |
| Chord Lab: chord naming (name, long name, rarity, tones with intervals, also reads as) | 5 | planned | pure TS function |
| Chord Lab: scales that fit | 5 | planned | |
| Chord Lab: STRUM sound | 5 | planned | |
| Chord Lab: quick chords row | 5 | planned | |
| Chord Lab: All chords sheet (12 roots × 18 shapes, voicings) | 5 | planned | |
| Chord Lab: left-handed mirror | 5 | planned | |

## Practice and results

| Feature | Phase | Status | Notes |
|---|---|---|---|
| Practice run (landscape note highway, count-in, hits/misses/buzz, pause, quit dialog, run complete) | 7 | mock only | judgements come from mock audio |
| Results: score, personal best, XP, streak, stats, coach text, save-failed retry | 7 | mock only | mock runs do not save unless dev flag |
| Input check: denied / quiet / noisy / fixed | 7 | mock only | denied state uses the real permission status |

## Progress and gamification

| Feature | Phase | Status | Notes |
|---|---|---|---|
| XP and levels with rank names (Bedroom Player, Garage Band, Opening Act, Headliner) | 6 | planned | |
| Daily goal and streak | 6 | planned | |
| Achievements ("Pick collection", 12) | 6 | planned | list confirmed in plan D9 |
| You: rank card, stat tiles, empty state | 6 | planned | |
| You: "Your mix" faders and accuracy chart | 7 | mock only | they need scored runs |
| XP from Metronome and Chord Lab activity | 6 | planned | values to approve |

## Settings

| Feature | Phase | Status | Notes |
|---|---|---|---|
| Playing: hand, guitar, headstock, daily goal, A4 reference | 3 → 6 | planned | |
| Listening: input sensitivity, noise gate, run input check | 7 | mock only | stored now, used by real audio later |
| Feedback: feel the beat, visual pulse, count-in, sound effects | 4 | planned | |
| Account: email, sign out | 2 | planned | |

## Out of scope for now

Real microphone stream, DSP/pitch detection, Android and iOS development builds (Google sign-in comes with the Android one), light mode.

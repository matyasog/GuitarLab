# Guitar app – prototype v2 ("pedalboard")

Live canvas (Claude Design): https://claude.ai/artifact/5GS9LSzT4DTueS4WNpC1Qs

This folder is a snapshot of the canvas sources, last updated 12 Oct 2026 after the design critique. Each `*.dc.html` file is one screen: 390×844 phone portrait, except Practice, which is 844×390 landscape. `canvas.json` is the canvas index. v2 replaces v1 (folder "Guitar app - prototype") as the design to build on.

## Design language

- **Concept:** a guitarist's pedalboard. The tuner and metronome are stompboxes in their own enamel colours, with silkscreen labels, screws, LEDs and footswitches. Fretboards are drawn as real wood.
- **Colour roles (the most important rule):**
  - **Amber `--amber` = act / now only.** Use it for primary buttons, the active tab LED, the next note in Practice, selected options, beat 1 on the metronome, and the tuner's turn arrow.
  - **Brass `--brass` = achievement and emphasis.** Use it for streak, XP, level pick, earned picks, progress LEDs, the personal-best stamp, and root notes on fretboards.
  - Green = correct or in tune; red = error or miss.
  - Pedal colours belong to the tools: tuner green, metronome orange, Chord Lab blue.
  - Lesson categories have their own tints: Rhythm orange, Scales sky blue, Melody pink, Arpeggios gold.
- **Typography:**
  - Big Shoulders Display (uppercase) only for page titles, pedal silkscreen labels and stage moments (PAUSED, PERFECT, the personal-best stamp).
  - Section headings and labels are sentence case, in Archivo.
  - DM Mono for numbers (BPM, cents, ms).
- **Navigation:** Today · Learn · Tuner · Chord Lab · You. The active tab has a lit amber LED. The Tuner tab opens the tuner; the metronome sits next to it in a Tuner/Metronome switch.
- **Dark only for now.**

## Design tokens (ready for `src/theme/`)

Every screen carries the same `.gl{…}` block of 71 CSS variables. No raw colour values appear anywhere else in the screens. Key ones:

| Token                                                         | Value                                        | Use                                                |
| ------------------------------------------------------------- | -------------------------------------------- | -------------------------------------------------- |
| `bg` / `surface` / `surface-2` / `surface-3`                  | #13110E / #1D1A16 / #26221D / #302B25        | backgrounds, cards, controls                       |
| `sunken` / `display` / `nav-bg` / `scrim`                     | #0D0B09 / #0A0907 / #0E0C0A / #13110E at 90% | inset panels, pedal LCD, tab bar, overlays         |
| `line` / `line-2`                                             | #3A342C / #4A4339                            | borders                                            |
| `text` / `text-2` / `muted` / `subtle`                        | #F4EEE3 / #DDD4C5 / #B3A898 / #A39887        | text levels (subtle passes 4.5:1 on every surface) |
| `amber` / `amber-ink` / `amber-soft`                          | #F5A524 / #1C1206 / #3A2A10                  | actions, "now"                                     |
| `brass`                                                       | #E2C48A                                      | achievements, roots                                |
| `green` / `red` (+ `-soft`)                                   | #4CC97E / #FF6A5C                            | status                                             |
| `wood`, `fret`, `nut`, `inlay`, `wound`, `plain`              |                                              | fretboard drawing                                  |
| `tuner`, `metro`, `lab` (+ `-dk`, `-ink`, `-ring`)            | #256B49 / #D9682B / #2F5FB8                  | pedal enclosures                                   |
| `cat-rhythm`, `cat-scales`, `cat-melody`, `cat-arp` (+ `-bg`) |                                              | lesson categories                                  |

- **Radius:** 8 (chips, small tiles), 12 (controls, rows), 18 (cards), 24 (pedals), 999 (pills). Bars of 4 px or less (LEDs, faders) are decorative and exempt.
- **Type scale:** 12 · 14 · 16 · 20 · 24 · 32 · 44 · 64 · 96 · 128 px. Nothing smaller than 12.
- **Switches:** one style everywhere, amber when on.
- **Touch targets:** at least 44 pt.

## Screens, states and flow

States are switched with the artboard's Tweaks (no extra screens).

| File                  | Screen               | States / key points                                                                                                                               |
| --------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Main.dc.html          | Sign in              | Google sign-in goes to Today (returning user); show/hide password; forgot-password message                                                        |
| Register.dc.html      | Sign up              | Email checked on blur, live password rules                                                                                                        |
| Onboarding.dc.html    | Onboarding           | Level (can be skipped), guitar type, strumming hand, headstock type (3+3 / 6 in line), mic permission, low E check                                |
| InputProblems.dc.html | Input problems       | Tweak: denied / quiet / noisy                                                                                                                     |
| Home.dc.html          | Today                | Tweak: regular / first-day / offline / loading. Session card comes first; streak is a compact strip                                               |
| LessonDetail.dc.html  | Lesson detail        | Scale shape on wood (brass roots), tempo choice, "tune first" nudge                                                                               |
| Practice.dc.html      | Practice (landscape) | Tap anywhere on the highway to pause; screen reader announces only misses and the end of the run                                                  |
| Results.dc.html       | Results              | Tweak: personal-best / normal / rough / save-failed. Confetti and stamp only for a personal best; rough run makes "Try at 64 BPM" the main action |
| Tuner.dc.html         | Tuner                | Headstock switch (3+3 / 6 in line), peg-turn arrow, instruction above the headstock                                                               |
| Metronome.dc.html     | Metronome            | Edge flash stops above 170 BPM, with reduced motion, or when Visual pulse is off                                                                  |
| ChordLab.dc.html      | Chord Lab            | Strum sound, key-aware spelling, brass root dots, 44 pt controls                                                                                  |
| Learn.dc.html         | Learn                | Tweak: regular / loading / error. "72 BPM · goal 80" for the current lesson                                                                       |
| Profile.dc.html       | You                  | Tweak: regular / empty (new player)                                                                                                               |
| Settings.dc.html      | Settings             | Hand, guitar, headstock, daily goal, A4 reference, input sensitivity, noise gate, feel the beat, visual pulse, count-in, sound effects            |

## Shared settings (kept between screens via localStorage in the prototype)

`gl-hand` (right/left), `gl-guitar`, `gl-level`, `gl-headstock` (3+3 / 6), `gl-a4` (430–450), `gl-pulse` (on/off).

## Shared prototype data (keep consistent)

- Streak: 12 days. Today: 9 of 15 minutes before the session; the run completes the goal and makes it 13.
- E minor pentatonic box 1: best 64% at 72 BPM (goal 80). Timing improved from +64 ms to +27 ms (personal-best outcome, 86%).
- Level 4, Bedroom Player: 1,240 XP before the session, 1,600 needed for level 5 (Garage Band).

## Still open

- Peg directions: the rule used is "pegs on the right-hand side of the headstock (front view) tighten clockwise, left-hand side anticlockwise". Check it on a real guitar.
- Not yet designed: a "turn your phone sideways" step before Practice, a visible slider under the metronome knob, and long-press-to-mute in Chord Lab.
- Amber and brass have similar lightness (1.2:1); they are told apart by role and saturation, and never touch in the same element.

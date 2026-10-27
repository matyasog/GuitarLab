# Design map

Index of the pen.dev design file `design/guitarlab.pen` (format version 2.21, ~3.9 MB of plain JSON, 85 top-level frames, 64 reusable components).
Generated on 2026-10-25 with `scripts/design/inspect-pen.js`. Re-run it when the design changes:

```bash
node scripts/design/inspect-pen.js frames        # every top-level frame with id and size
node scripts/design/inspect-pen.js texts <id>    # all copy inside a frame (incl. component overrides)
node scripts/design/inspect-pen.js refs          # which components each screen uses
node scripts/design/inspect-pen.js tree <id> 3   # layer tree of one frame
```

Routes are **planned** (nothing exists yet besides the template's `src/app/index.tsx`). Route files live in `src/app/` (Expo Router). `(group)` folders do not appear in the URL.

---

## 1. Screens

### Auth (outside the tab bar)

| Screen · state | Frame (id) | Planned route | Main components |
|---|---|---|---|
| Sign in · default | `Sign in / regular / default` (J8F6x) | `src/app/(auth)/sign-in.tsx` | TextField, PasswordField, Button primary/secondary/ghost, hero wood texture |
| Sign in · forgot-password (green "Reset link sent…" helper) | `Sign in / regular / forgot-password` (z98vJH) | same screen, state | same |
| Sign up · empty | `Sign up / regular / empty` (S9SDm) | `src/app/(auth)/sign-up.tsx` | ScreenHeader/back, TextField ×2, PasswordField with live rules, Button |
| Sign up · email-error | `Sign up / regular / email-error` (uNXZ5) | same screen, state | TextField/error |

### Onboarding (after sign-up, before the tabs)

| Screen · state | Frame (id) | Planned route | Main components |
|---|---|---|---|
| Level · selected / empty | `Onboarding / regular / level` (TGJsm), `… / level-empty` (Yqpmb) | `src/app/(app)/onboarding/level.tsx` | ListRow ×4 (selectable), Button primary (disabled when empty), Button ghost "Skip" |
| Guitar · selected / empty | `… / guitar` (RrQLs), `… / guitar-empty` (EHJhr) | `…/onboarding/guitar.tsx` | Card ×2 (acoustic/electric), SegmentedControl ×2 (hand, headstock) |
| Microphone | `… / microphone` (l1vLe) | `…/onboarding/microphone.tsx` | EmptyState-style intro, 3 bullet lines, Button "Allow microphone", ghost "Not now…" |
| Low E · waiting / hearing / done | `… / low-e-waiting` (DMD12), `… / low-e-hearing` (zb14N), `… / low-e-done` (tPVvO) | `…/onboarding/low-e.tsx` (mock audio) | Card with level meter, Button disabled → "Let's play" |

### Tabs (tab bar: Today · Learn · Tools · Chord Lab · You, 84 pt incl. inset)

The design names the third tab "Tuner" (speaker icon). In the app it is **"Tools"** (audio-waveform icon) since 2026-10-26, because it holds both the Tuner and the Metronome (see docs/decisions.md).

| Screen · state | Frame (id) | Planned route | Main components |
|---|---|---|---|
| Today · regular / scrolled | `Today / regular / regular` (g8cv3d), `… / scrolled` (oJ25M) | `src/app/(app)/(tabs)/index.tsx` | `LevelBadge` (→ You), StreakStrip (week + daily goal), `SessionCard` (with `ScaleShape` preview), SectionHeader, ListRow ×2 (category icon colours), TabBar. Built in 3.6. Not in the design: "Today's session" before 17:00, session/Up next pick rules, ≈ 4 min for Chromatic warm-up, error state, dev Play note |
| Today · first-day | `Today / regular / first-day` (NDL9C) | same, state | same |
| Today · offline | `Today / regular / offline` (RZHGr) | same, state | Toast/info "You're offline…" |
| Today · loading | `Today / regular / loading` (xSOS8) | same, state | Skeleton/card, Skeleton/list row ×3 |
| Learn · regular / scrolled | `Learn / regular / regular` (f5kLcb), `… / scrolled` (OrD7Z) | `src/app/(app)/(tabs)/learn.tsx` | ScreenHeader/tool ("7 of 12 done"), ProgressBar/XP, category Segments (All/Rhythm/Scales/Melody/Arpeggios), SectionHeader ×4 (In progress / Up next / Locked / Done), ListRow ×12, Tag/category |
| Learn · loading | `Learn / regular / loading` (eebgt) | same, state | Skeleton/list row ×7 |
| Learn · error | `Learn / regular / error` (x7MjHQ) | same, state | ErrorState "Couldn't load your progress" + "Try again" |
| Lesson detail · default (72 suggested) / tempo-64 | `Lesson detail / regular / default` (FVYUG), `… / tempo-64` (T6Kpct) | `src/app/(app)/lesson/[lessonId].tsx` (outside the tabs: no tab bar in the design) | ScreenHeader/back, scale-shape fretboard (wood), StatTile ×3, tempo Segments (warm-up/suggested/goal), "Tune first" ListRow, Button "Play at N BPM" | Built in 3.5: `ScaleShape`, `TempoOptions`, `DifficultyMarks`, `Screen footer`. Not in the design: tempo rule (warm-up −8, goal = goalBpm or +8), never-played stats ("–", 0 runs), "coming soon" toast (closable with an × button, new `Toast onClose` prop), loading/error/not-found states, shapes for other lessons, no diagram for rhythm/melody/5th-position lessons |
| Tuner · flat / in-tune (3+3) | `Tuner / regular / flat` (JZRND), `… / in-tune` (vPReW) | `src/app/(app)/(tabs)/tools/tuner.tsx` | ScreenHeader/tool, ToolSwitch, Tuner instrument (75 %), live readout, instruction line, HeadstockSwitch 3+3, TabBar |
| Tuner · 6-in-line | `Tuner / regular / 6-in-line` (bhZhR) | same, state | HeadstockSwitch/6 in line |
| Tuner · compact flat / in-tune | `Tuner / compact / flat` (S7joy), `… / in-tune` (KKRaE) | same, compact layout | headstock collapses to a row of 6 string buttons |
| Metronome · stopped / beat 1 / other beat / speed trainer / above 170 | `Metronome / regular / stopped` (q6MMx), `… / playing-beat-1` (lWSm7), `… / playing-other-beat` (hjQHv), `… / speed-trainer-on` (btpDR), `… / above-170` (EQ55r) | `src/app/(app)/(tabs)/tools/metronome.tsx` | ToolSwitch, Metronome instrument (50 %), tempo name + BPM readout, ±1/±5, Start/Stop, TAP, SegmentedControl ×3 (time sig, subdivision, sound), beat lamps, Speed trainer + Switch, Timing histogram |
| Metronome · compact stopped / beat 1 / above 170 | `Metronome / compact / …` (BYbF1, Xh1Na, AZqC3) | same, compact layout | instrument at 40 % |
| Metronome · text 130 % | `Metronome / regular / stopped / text 130%` (QVrlc) + `Note / large text rule` (F7XFgh) | same | rows stack when `fontScale ≥ 1.2` |
| Chord Lab · default / scrolled | `Chord Lab / regular / default` (Exwth), `… / default / scrolled` (k8gDq) | `src/app/(app)/(tabs)/chord-lab.tsx` | ScreenHeader/tool ("Clear", "All chords"), chord readout (name, rarity badge, long name, tone chips, STRUM), interactive fretboard (wood), quick-chord chips ×11, theory card |
| Chord Lab · empty / scrolled | `Chord Lab / regular / empty` (j4LeS8), `… / empty / scrolled` (nrqag) | same, state | STRUM disabled, "Add some notes first" |
| All chords sheet | `Chord Lab / All chords` (V8RxC) | `src/app/(app)/all-chords.tsx` (full-screen modal) | BottomSheet (full screen), root picker 6×2, grouped list with voicing buttons |
| You · regular / empty | `You / regular / regular` (FdMSK), `… / empty` (R6rBK) | `src/app/(app)/(tabs)/you.tsx` | Rank card (level badge, XP bar, rank ladder), StatTile ×3, "Your mix" faders, accuracy chart, "Pick collection" achievements grid |

### Pushed / modal screens (no tab bar)

| Screen · state | Frame (id) | Planned route | Main components |
|---|---|---|---|
| Settings | `Settings / regular / default` (Nn4Eu) | `src/app/(app)/settings.tsx` | ScreenHeader/back, Card ×4 (Playing, Listening, Feedback, Account), SegmentedControl, Switch rows, "Sign out" |
| Input check · denied / quiet / noisy / fixed | `Input check / regular / …` (IIbPJ, gwEgq, F25ur4, kebvM) | `src/app/(app)/input-check.tsx` | ScreenHeader/back, level meter card, numbered steps, Button primary + ghost |
| Results · personal-best / normal / rough / save-failed | `Results / regular / …` (qYw9X, hpQbc, fVWcy, kB2XH) | `src/app/(app)/results.tsx` | score gauge 0–100, StatTile (XP, streak), stats card, coach card, Toast/error "Couldn't save this run." |
| Practice (landscape) · layout + K1–K10 | `Practice / regular / layout` (Cq6JO), `… / K1 count-in 4` … `K10 run complete` (j4gJ8v, xpVlO, yIGb8, b2gK7Z, Uv9qC, GgY1C, b8XBeq, aYpPP, NOcn3, s2iFy) | `src/app/(app)/practice.tsx` | note highway (static-highway, feedback-overlay, moving-notes), IconButton ×2, ProgressBar, ListeningIndicator, Dialog (quit) |
| Practice compact · layout / quit | `Practice / compact / …` (DaG0r, ePNE5) | same, compact | 640×360 |
| Practice motion spec | `Practice / motion spec` (SmciK) | — (spec only) | see `design/scripts/practice-highway.js` |

### Non-screen sheets

| Frame (id) | What it is |
|---|---|
| `Tokens` (bi8Au) | variables sheet, incl. silkscreen font comparison (Barlow Semi Condensed vs Michroma; Barlow won) |
| `Components – quiet studio` (TUggp) | component kit: Buttons, Inputs, Content, Controls & progress, Navigation & overlays, States |
| `Tuner / instrument` (lNiub) | 5 instrument states + "Layers for React Native" spec |
| `Metronome / instrument` (Plm73) | 4 instrument states + layer spec + `scaleY(bpm)` mapping |

---

## 2. Components (reusable in the `.pen` file → planned code component)

| `.pen` component(s) | Planned file | Notes from the kit |
|---|---|---|
| Button / primary · secondary · ghost × default · pressed · disabled | `src/components/Button.tsx` | height 48; pressed primary uses `color.amber-pressed` |
| Icon button / default · pressed · disabled | `src/components/IconButton.tsx` | 44 × 44 |
| Text field / default · focused · error | `src/components/TextField.tsx` | label, placeholder, helper/error line |
| Password field / hidden · shown | `src/components/PasswordField.tsx` | the kit shows an eye icon, but the Sign in / Sign up screens override it with a "Show" text button (`labelStrong14`, `text-2`), so the code follows the screens; "Forgot password?" goes in the label row, live rules in the footer |
| Card | `src/components/Card.tsx` | max one soft shadow |
| List row | `src/components/ListRow.tsx` | no shadow |
| Section header | `src/components/SectionHeader.tsx` | title + optional right text |
| Tag / rhythm · scales · melody · arp | `src/components/Tag.tsx` | `color.cat-*` |
| Switch / on · off | `src/components/Switch.tsx` | track 52 × 32, whole row toggles |
| Tool switch / tuner · metronome | `src/components/ToolSwitch.tsx` | "Tuner \| Metronome" |
| Segmented control, Segment, Segment / selected | `src/components/SegmentedControl.tsx` | |
| Headstock switch / 3+3 · 6 in line | `src/components/tuner/HeadstockSwitch.tsx` | 6 tappable pegs |
| Progress bar / XP | `src/components/ProgressBar.tsx` | brass |
| Streak strip | `src/components/StreakStrip.tsx` | week dots + "9/15 min today" |
| Stat tile | `src/components/StatTile.tsx` | |
| Tab item, Tab item / active, Tab bar | `src/components/TabBar.tsx` | custom `tabBar` for Expo Router `Tabs` |
| Listening indicator | `src/components/ListeningIndicator.tsx` | green dot + "Listening" |
| Screen header / tool · back | `src/components/ScreenHeader.tsx` | |
| Bottom sheet | `src/components/BottomSheet.tsx` | React Native `Modal`; grabber is visual only (no drag-to-close yet) |
| Toast / info · success · error | `src/components/Toast.tsx` | placed inline in the screens (Today offline, Results save-failed), not floating |
| Dialog | `src/components/Dialog.tsx` | |
| Skeleton / card · list row | `src/components/Skeleton.tsx` (`SkeletonCard`, `SkeletonListRow`) | opacity pulse, off with Reduce Motion |
| Empty state, Error state | `src/components/StateMessage.tsx` (`EmptyState`, `ErrorState`) | same layout, so one file |
| Tuner / static-body · glass-overlay (100 %, 75 %) | `src/components/tuner/TunerInstrument.tsx` | baked images |
| Metronome / static-body · moving-pendulum · glass-overlay (100 %, 50 %, 40 %) | `src/components/metronome/MetronomeInstrument.tsx` | baked images |

---

## 3. Tokens

`.pen` variable → planned `src/theme` name → value. Code names use camelCase of the `.pen` name (`color.surface-2` → `colors.surface2`).

### Colours (`src/theme/colors.ts`)

| `.pen` | `src/theme` | Value | Role |
|---|---|---|---|
| color.bg | colors.bg | `#13110E` | app background |
| color.surface | colors.surface | `#1D1A16` | cards |
| color.surface-2 | colors.surface2 | `#26221D` | raised controls |
| color.surface-3 | colors.surface3 | `#302B25` | pressed / highest |
| color.sunken | colors.sunken | `#0D0B09` | inset areas |
| color.display | colors.display | `#0A0907` | dark display panels |
| color.nav-bg | colors.navBg | `#0E0C0A` | tab bar |
| color.scrim | colors.scrim | `#13110EE6` | behind sheets/dialogs |
| color.shadow | colors.shadow | `#00000055` | soft card shadow |
| color.line | colors.line | `#3A342C` | hairlines |
| color.line-2 | colors.line2 | `#4A4339` | stronger borders |
| color.text | colors.text | `#F4EEE3` | primary text |
| color.text-2 | colors.text2 | `#DDD4C5` | secondary text |
| color.muted | colors.muted | `#B3A898` | muted text |
| color.subtle | colors.subtle | `#A39887` | least emphasis |
| color.amber | colors.amber | `#F5A524` | act / now |
| color.amber-ink | colors.amberInk | `#1C1206` | text on amber |
| color.amber-soft | colors.amberSoft | `#3A2A10` | amber tint bg |
| color.amber-wash | colors.amberWash | `#F5A52414` | faint amber wash |
| color.amber-pressed | colors.amberPressed | `#FFC35C` | pressed primary |
| color.brass | colors.brass | `#E2C48A` | achievement |
| color.brass-soft | colors.brassSoft | `#3A3122` | brass tint bg |
| color.green | colors.green | `#4CC97E` | correct / in tune |
| color.green-soft | colors.greenSoft | `#16301F` | |
| color.red | colors.red | `#FF6A5C` | error / miss |
| color.red-soft | colors.redSoft | `#3A1B17` | |
| color.cat-rhythm / -bg | colors.catRhythm / catRhythmBg | `#F6A877` / `#F08A4B2E` | lesson category |
| color.cat-scales / -bg | colors.catScales / catScalesBg | `#9FCDF7` / `#6FB3F22E` | |
| color.cat-melody / -bg | colors.catMelody / catMelodyBg | `#F6AED3` / `#F28DC02E` | |
| color.cat-arp / -bg | colors.catArp / catArpBg | `#EFD58F` / `#E9C46A2E` | |
| color.fret | colors.fret | `#C9C2B4` | fretboard drawing |
| color.nut | colors.nut | `#EFE6D2` | |
| color.inlay | colors.inlay | `#E8DFCB` | |
| color.wound | colors.wound | `#C8A86B` | wound strings |
| color.plain | colors.plain | `#E2E2E2` | plain strings |
| color.wood / -dark / -light | colors.wood / woodDark / woodLight | `#4A2C1C` / `#2A170E` / `#6E4029` | materials |
| color.brass-metal / -light / -dark | colors.brassMetal / brassMetalLight / brassMetalDark | `#B8924A` / `#E8CF94` / `#6E5226` | |
| color.anodized / -light / -dark | colors.anodized / anodizedLight / anodizedDark | `#1F1D1B` / `#34312D` / `#131211` | tuner case |
| color.chrome / -light / -dark | colors.chrome / chromeLight / chromeDark | `#8E8C88` / `#E6E4DF` / `#45433F` | tuning machines |
| color.enamel-cream / -ink / -shade | colors.enamelCream / enamelInk / enamelShade | `#EDE3CC` / `#2B231B` / `#D9CCAF` | metronome scale |
| color.silkscreen | colors.silkscreen | `#EFE6D2` | instrument labels |
| color.strobe-bg / -glow / -dim | colors.strobeBg / strobeGlow / strobeDim | `#0E0A06` / `#FFB547` / `#33220F` | strobe display, live readout |
| color.glass / glass-clear | colors.glass / glassClear | `#FFFFFF14` / `#FFFFFF00` | |
| color.specular | colors.specular | `#FFFFFF38` | |
| color.led-off | colors.ledOff | `#2A2520` | unlit lamps |
| color.bg-clear, shade, shade-clear | colors.bgClear / shade / shadeClear | `#13110E00` / `#00000073` / `#00000000` | gradient stops |
| color.flash-accent | colors.flashAccent | `#F5A52455` | edge flash on beat 1 |
| color.flash-beat | colors.flashBeat | `#EFE6D2AA` | edge flash on other beats |

Most material/gradient tokens are only needed for drawing the instruments; once the instruments are baked into images, code only needs the readout and lamp colours.

### Spacing, radii, type sizes

| `.pen` | `src/theme` | Value |
|---|---|---|
| space.4 … space.32 | `space[4]`, `space[8]`, `space[12]`, `space[16]`, `space[20]`, `space[24]`, `space[32]` | 4, 8, 12, 16, 20, 24, 32 |
| radius.chip | radii.chip | 8 |
| radius.control | radii.control | 12 |
| radius.card | radii.card | 16 |
| radius.pill | radii.pill | 999 |
| type.12 … type.96 | `typeSize[12]` … `typeSize[96]` | 12, 14, 16, 20, 24, 32, 44, 64, 96 |

Line heights and letter spacing are set per text node in the `.pen` file, not as variables. Step 1.1 collected the combinations the screens use and defined them as named text styles in `src/theme/typography.ts` (e.g. `title24`, `body16`, `label14`, `readout64`, `silkscreen12`). Line heights in the `.pen` file are multiples of the font size (1.45 → 16 × 1.45 ≈ 23 pt). Sizes like 15.6 / 18.2 / 20.8 appear only in the "text 130 %" frame and are not tokens. Every token is checked against the `.pen` file by `__tests__/theme-tokens-test.ts`.

---

## 4. Fonts

| `.pen` variable | Family | Weights used in the design | Source | Licence |
|---|---|---|---|---|
| font.ui | Archivo | 400, 500, 600 | Google Fonts, npm `@expo-google-fonts/archivo` | SIL Open Font License 1.1 |
| font.mono | DM Mono | 400, 500 | Google Fonts, npm `@expo-google-fonts/dm-mono` | SIL Open Font License 1.1 |
| font.silkscreen | Barlow Semi Condensed | 400, 500, 600 | Google Fonts, npm `@expo-google-fonts/barlow-semi-condensed` | SIL Open Font License 1.1 |
| — | Michroma | — | only on the Tokens sheet (rejected silkscreen option) | not needed |

Silkscreen text on baked instruments is part of the image, so Barlow Semi Condensed is only needed in code for live labels (FLAT / SHARP / IN TUNE / AUTO / MANUAL, PERSONAL BEST). These all use weight 600, so only that weight is loaded. Loaded fonts: Archivo 400/500/600, DM Mono 400/500, Barlow Semi Condensed 600.

---

## 5. Assets to export

### Images already in the repo (`design/`)

| File | Size | Used for | Action |
|---|---|---|---|
| `design/generated.png` | 709 KB | brushed-metal texture of the Tuner case | baked into Tuner static-body; not needed separately |
| `design/generated-1.png` | 891 KB | walnut grain (Metronome body, Tuner headstock wood) | headstock wood: convert to WebP, resize to ~2× display size |
| `design/generated-5.png` | 1 MB (actually a 1408 × 768 JPEG) | rosewood hero art on Sign in | done: `assets/images/sign-in-hero.webp`, 1320 × 720, 162 KB, made by `scripts/assets/make-images.py`; frets, strings, dim layer and fade are drawn in code (`SignInHero`) |
| `design/generated-3.png` | 0.7 MB (JPEG) | acoustic guitar photo, Onboarding / guitar card (inside a component override, missed by the first scan) | done: `assets/images/guitar-acoustic.webp`, 990 × 540, 27 KB |
| `design/generated-4.png` | 0.7 MB (JPEG) | electric guitar photo, Onboarding / guitar card | done: `assets/images/guitar-electric.webp`, 990 × 540, 26 KB |
| `design/generated-2.png` | 0.6 MB | not referenced by any frame | ignore |
| Unsplash photo `photo-1620671716215-b2c6609996fe` | remote URL | Chord Lab fretboard wood | not used: replaced by the walnut texture `generated-1.png` (decided 2026-10-26) |

### Instrument layers (from the layer specs in the file)

| Layer | Source frame (id) | Pivot / notes | Export as |
|---|---|---|---|
| Tuner static-body | `Tuner / static-body` (XxlvZ), 320 × 400 | case, unlit strobe track, lamp bezels, footswitch, silkscreen | `assets/instruments/tuner/static-body.png` @2x + @3x (960 × 1200) |
| Tuner moving-strobe | lit segments of the ring, 196 × 196 | **no standalone frame yet**; rotates around its centre (98, 98) = (160, 164) in the instrument; stopped below ±4 ¢ | `…/tuner/strobe-lit.png` |
| Tuner moving-lamps | LOCK lens (green), AUTO LED (amber), flat/sharp arrows lit | **no standalone frames yet**; opacity fades only | `…/tuner/lamp-lock-on.png`, `lamp-auto-on.png`, `arrow-flat-on.png`, `arrow-sharp-on.png` |
| Tuner live-readout | — | RN `Text`, not an image (colour `strobe-glow`) | — |
| Tuner glass-overlay | `Tuner / glass-overlay` (ppy3S), 280 × 272 | over the display window at (20, 40); `pointerEvents="none"` | `…/tuner/glass-overlay.png` |
| Metronome static-body | `Metronome / static-body` (Gdat7), 320 × 520 | walnut case, enamel gauge, pivot plate, wordmark | `assets/instruments/metronome/static-body.png` @2x + @3x (960 × 1560) |
| Metronome moving-pendulum | `Metronome / moving-pendulum` (F0Glit), 32 × 354 | rod + hub **without the weight**; pivot (16, 344) = (160, 408) in instrument; swings ±25° | `…/metronome/pendulum.png` |
| Metronome moving-weight | `moving-weight · index = top edge` (ss4P3), 22 × 22 | child of pendulum; top edge y = scaleY(bpm) − 64 in pendulum coords; scaleY(bpm) = 88 + 288 × (bpm − 40) / 200 | `…/metronome/weight.png` |
| Metronome glass-overlay | `Metronome / glass-overlay` (zSMxW), 320 × 520 | lacquer sheen | `…/metronome/glass-overlay.png` |

The 75 % / 50 % / 40 % copies in the file are the same artwork scaled for the screens; in code we export once at full size and scale the image.

### Visual reference PNGs (for me to compare against while coding)

Export these from pen.dev at **@2x** into `docs/design/screens/`, file name = frame name with ` / ` → `__` and spaces → `-`:

- `Tuner / instrument` → `Tuner__instrument.png`
- `Metronome / instrument` → `Metronome__instrument.png`
- `Components – quiet studio` → `Components.png`
- `Tokens` → `Tokens.png`
- `Practice / motion spec` → `Practice__motion-spec.png`
- every `Metronome / regular / …` and `Metronome / compact / …` frame (9 files, e.g. `Metronome__regular__playing-beat-1.png`)
- every `Tuner / regular / …` and `Tuner / compact / …` frame (5 files)
- `Chord Lab / regular / default`, `Chord Lab / regular / empty`, `Chord Lab / All chords`
- `Today / regular / regular`, `Learn / regular / regular`, `Lesson detail / regular / default`, `You / regular / regular`, `Results / regular / personal-best`, `Sign in / regular / default`
- `Practice / regular / layout`, `Practice / regular / K5 mid-run combo`

### Icons

The design uses 234 `icon` nodes, all from the **Lucide** library (ISC licence). 46 distinct names: arrow-left, audio-lines, audio-waveform, award, book-open, chart-no-axes-column-increasing, check, chevron-down/right/up, circle, circle-alert, circle-check, circle-dot, drum, eye, eye-off, flame, grid-3x3, guitar, hand, library, lock, mic, minus, music, pause, play, plus, rotate-ccw-square, rotate-cw, signal(-high/-low/-medium), sliders-horizontal, sparkles, speaker, square, target, triangle-alert, type, user, wifi, wifi-off, x (signal/wifi/battery are only the fake status bar).
Used via `lucide-react-native` (on top of `react-native-svg`, which is in Expo Go), so names match the design 1:1. `src/components/Icon.tsx` lists the 44 non-status-bar icons; "music" is called "eighth-notes" in Lucide 1.x.

### Sounds (not in the design)

Metronome sounds "Click", "Woodblock", "Hi-hat" (+ accent variants), chord/strum sound, optional UI "sound effects" (hit, streak, level-up). Source decided in `docs/plan.md` → Decisions.

---

## 6. Gaps and questions

1. **Tuner states missing as screens:** the brief asks for no-signal, flat, sharp, in-tune and manual. Full screens exist only for flat, in-tune and 6-in-line (+ compact flat/in-tune). No-signal, sharp and manual exist only on the instrument sheet. Plan: build them from the instrument sheet + the flat screen (same layout, different readout).
2. **Moving tuner layers have no standalone frames** (lit strobe ring, lamps on, lit arrows). Resolved 2026-10-26: they are drawn in code with `react-native-svg` (plan D5).
3. **"Sign in / Sign up with Google"** buttons: hidden until the Android dev build (plan D13).
4. **Auth error copy** is designed only for "invalid email" and "reset link sent". No copy for wrong password, account not found, email already in use, too many attempts, network error.
5. **Metronome sound options:** the Sound segmented control uses the kit's default labels "Click / Woodblock / Hi-hat / Option 4". Resolved: "Option 4" is a placeholder and is left out (plan D1).
6. **Achievements:** "Pick collection 4 of 12" shows 6 badges (7-day streak, Perfect pitch run, 120 BPM club, First 100%, 30-day streak, Barre chord boss). The other 6 are not designed.
7. **Settings entry point:** opened from the `sliders-horizontal` icon button in the You header (found in frame FdMSK). OK, no gap.
7b. **Noto Music font:** the kit note on the segmented control says subdivision glyphs (♩ ♫ ♬) use **Noto Music** at `type.20`. It is not a `.pen` font variable. Needed for the metronome (step 4.2); `@expo-google-fonts/noto-music` (OFL), to confirm then.
8. **No designs for:** "All lessons" list on Today (it may just link to Learn), a "Details" target from Today's session card (probably Lesson detail), sign-up → onboarding transition, Lesson detail loading/error states, Chord Lab "colour chord" state (optional in spec), Input check "checking…" state.
9. **Practice landscape on iOS:** Expo Go can lock orientation at runtime, but iOS 27 (SDK 58) makes apps resizable and `lockAsync` may have no effect.
10. **Chord Lab wood:** the design uses a remote Unsplash photo. Resolved 2026-10-26: reuse the walnut texture `design/generated-1.png`.

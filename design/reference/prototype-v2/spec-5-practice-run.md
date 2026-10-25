# Spec 5 – Practice run (the exercise) and its animation

Content, states and motion for the Practice screen, where the exercise is actually played. The visual style comes from the design brief, the Tokens and the Components kit. This is a quiet-studio screen: the strings on the highway may look real (same gauges and colours as Chord Lab), but nothing here is as rich as the tuner or metronome.

- **Orientation:** landscape.
- **Frames:** regular 844 × 390 and compact 640 × 360. Safe areas on the left and right (notch side) and the bottom (home indicator). No tab bar.
- **Exercise:** "E minor pentatonic, box 1" at 72 BPM, one note per eighth-note click.

---

## 1. Layout (left to right, top to bottom)

### Top bar (one row, 44 pt tall)
- Quit button (×)
- Title "E minor pentatonic, box 1", with a thin run progress bar under it (fills per note played)
- Listening pill: a red dot and an 8-bar mini input meter (green bars, the top 2 amber)
- Tempo pill "72 BPM" (amber text on soft amber, DM Mono)
- Pause / resume button

### Left column (about 200 pt wide)
- **Prompt label:** "Count-in" / "Play now" / "Paused" / "Done"
- **Big note name**, very large, e.g. "E". During the count-in it shows the countdown number 4 → 1 in amber. When done it shows a check.
- **Where line:** "low E string · open", "A string · fret 2", etc. During the count-in: "First: low E, open". When done: "23 notes".
- Flexible space.
- **Feedback** at the bottom: a word plus a detail line (DM Mono):

| Result | Word (colour) | Detail |
|---|---|---|
| perfect (|timing| < 25 ms) | Perfect (green) | "−8 ms early" / "+12 ms late" |
| good (25–64 ms) | Good (cream) | "+41 ms late" |
| miss (≥ 65 ms) | Missed (red) | "+78 ms late" |
| buzz | Buzz (red) | "press right behind the fret" |
| muted | Muted (red) | "the note died too early" |
| count-in | Ready (amber) | "four clicks, then go" |

### Note highway (the rest of the screen, one large rounded panel)
- **Background:** the darkest surface (sunken).
- **6 horizontal lanes,** high e at the top and low E at the bottom. Each lane has:
  - its string label on the left (DM Mono: e B G D A E)
  - a string across the lane (plain strings thin and light; wound strings E A D thicker and bronze)
- **Active lane** (the string of the next note): soft amber wash, amber label, string at full opacity. The other strings are dimmed to about 45%.
- **Hit line:** a vertical amber bar about 85 pt from the left edge of the highway. Notes are played when they cross it.
- **Note tokens:** rounded rectangles (about 46 × 34 pt) on their lane, showing the fret number (DM Mono). They are spaced 112 pt per note (one eighth note at 72 BPM). Token states:
  - **upcoming:** cream outline, cream number, transparent fill
  - **next** (the one to play now): solid amber, dark number. v2 gave it a glow; in v3 use a crisp 2 pt outer ring instead (no blur on moving parts).
  - **perfect:** solid green with a small check
  - **good:** solid cream
  - **missed / buzz / muted:** dark red fill, dashed red border, a small ×
- **Stats chip** (bottom right, on a dark translucent scrim, DM Mono): "92% hit" · "+22 ms" · "×5 combo" (brass; shown only from 3 in a row).
- **Tapping anywhere on the highway pauses.**

### Note sequence (23 notes: up the box, then back down)
Format string:fret.

- **Up:** E:0, E:3, A:0, A:2, D:0, D:2, G:0, G:2, B:0, B:3, e:0, e:3
- **Down:** e:0, B:3, B:0, G:2, G:0, D:2, D:0, A:2, A:0, E:3, E:0

Note names: E:0 = E, E:3 = G, A:0 = A, A:2 = B, D:0 = D, D:2 = E, G:0 = G, G:2 = A, B:0 = B, B:3 = D, e:0 = E, e:3 = G.

---

## 2. Overlays

- **Paused:** a scrim over the highway only, with a play icon, "Paused", and "Tap anywhere here to keep playing". The highway freezes in place.
- **Quit dialog** (from ×): title "Quit this run?", text "This run won't count towards your score or today's minutes." Buttons: "Keep playing" (primary) and "Quit" (secondary, goes to Lesson detail).
- **Run complete dialog:** title "Run complete", line "20 of 23 notes clean · average +22 ms". Buttons: "Again" (secondary) and "See results" (primary, goes to Results).

---

## 3. Storyboard keyframes (one frame each)

Name them "Practice / regular / K1 count-in 4" and so on.

| # | Moment | Beat position | What's visible |
|---|---|---|---|
| K1 | Count-in, first click | −4 | big "4" (amber), "Ready", first tokens far right, no results |
| K2 | Count-in, last click | −1 | big "1"; the first token (E:0, next = amber) approaching the hit line |
| K3 | First note on the line | 0.0 | E:0 exactly on the hit line, low E lane active, "Play now", big "E" |
| K4 | First hit, perfect | 0.1 | E:0 green with check, just past the line; hit line and screen edge flash green; "Perfect −8 ms early"; next token E:3 amber; big "G" |
| K5 | Mid-run, combo | 7.1 | G:2 (note 8) just judged good (cream); all previous tokens green or cream; "Good +31 ms late"; stats "100% hit · +19 ms · ×8 combo"; next token B:0 amber, so the B lane is active and the big note is "B" |
| K6 | A miss | 14.1 | B:0 on the way down (note 15) missed (red, dashed); hit line and edge flash red; "Missed +78 ms late"; stats "93% hit"; combo hidden; next G:2 |
| K7 | A buzz | 18.1 | D:0 (note 19) buzz (red); "Buzz · press right behind the fret"; next A:2 |
| K8 | Paused | 18.6 | paused overlay on the highway, prompt label "Paused" |
| K9 | Quit dialog | 18.6 | quit dialog over the whole screen |
| K10 | Run complete | 23 | big check, "Done", run complete dialog |

Every frame must be one exact moment. Tokens are positioned with the formula in section 4, so the frames line up like film frames.

---

## 4. Motion spec (for the code; put it on a "Practice / motion spec" frame)

**The highway is driven by the audio clock, never by timers.**
- `x(note) = hitLineX + (note.beat − currentBeat) × 112`
- `currentBeat` comes from the metronome audio scheduler.
- Movement is **linear**, with no easing: musical time is linear, and any easing would make notes look early or late.

| Element | Trigger | Motion | Duration |
|---|---|---|---|
| Note strip (all tokens) | every frame | translateX of ONE container, linear | continuous |
| Token result colour | note judged | instant colour swap + scale pop 1 → 1.08 → 1 | 120 ms |
| Hit line flash | note judged | colour → result colour, fade back to amber | 250 ms |
| Screen edge flash | note judged | 3 pt inset border in the result colour, fade out | 300 ms |
| Active lane | next note changes string | amber wash cross-fades to the new lane | 120 ms |
| Big note name | next note changes | cross-fade | 80 ms |
| Count-in number | each click | scale 1.1 → 1 | 150 ms |
| Feedback word | note judged | appears instantly, stays until the next result | – |
| Combo | ≥ 3 in a row | number change, small pop | 120 ms |
| Paused overlay | pause | fade in, highway freezes | 150 ms |
| Dialogs | open | fade + scale 0.96 → 1 | 200 ms |

**Accessibility rules:**
- The **edge flash** only happens when Visual pulse is on, BPM ≤ 170, and reduced motion is off.
- With **reduced motion**, the highway still scrolls, because it is the exercise itself. Turn off all pops, flashes and cross-fades.
- A **screen-reader live region** announces misses ("Missed note", "Missed buzz", "Missed muted note"), "Paused" and "Run complete".

**Performance rules (from the brief, section 6):**
- Layer **static-highway** (panel, lanes, strings, labels, hit-line base) is baked once.
- Layer **moving-notes** is a single strip that is only translated.
- Layer **feedback-overlay** holds the hit-line flash and edge flash; only its opacity changes.
- Token colours change only on note events (about 2 per second), never per frame.
- At most about 8 tokens are on screen. Tokens leaving the left edge are recycled.
- No blur or glow on moving tokens.

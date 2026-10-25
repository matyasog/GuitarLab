# Spec 2 – Learning (from prototype v2)

Content, copy, states and flow for Agent 2. The visual style comes from the design brief, the Tokens and the Components kit. This spec only says WHAT is on each screen, top to bottom.

All screens: 390×844, dark, safe areas. Today and Learn have the tab bar (Today · Learn · Tuner · Chord Lab · You), with the active tab shown in amber. Lesson detail has no tab bar.

Shared data (keep consistent):
- user "Matyáš", level 4 "Bedroom Player", streak 12 days, today 9 of 15 minutes
- current lesson "E minor pentatonic, box 1": best 64% at 72 BPM, goal 80 BPM

---

## Today (Home)

Top to bottom (scrolls above the tab bar):

1. **Header:**
   - left: date "Monday 12 October" (small, muted) and the greeting "Hi, Matyáš"
   - right: a level badge (brass) showing "4", which opens You. v2 shaped it like a guitar pick; a refined badge is fine.
2. **Offline banner** (offline state only), with a wifi-off icon: "**You're offline.** Practice still works. Your scores and streak sync when you're back online."
3. **Streak and daily goal strip** (one compact card):
   - left: "12" (brass, big) and "day streak"
   - middle: 7 day dots. The first 6 are filled brass (goal met); "Today" is a dashed brass ring.
   - right: a ring progress (brass) showing "9/15" (DM Mono) and "min today"
4. **Session card** (the main element):
   - **Top part:** a small fretboard preview in wood showing the E minor pentatonic box 1. Frets 0–3, 6 strings, root notes (E) in brass, other notes in cream, open strings as rings. It mirrors for left-handed users.
   - **Kicker** "Tonight's session" and **title** "E minor pentatonic, box 1"
   - **Chips:** "72 BPM", "≈ 6 min", "Scales" (Scales category tint)
   - **Coach text:** "Your last three runs landed 64 ms behind the click, so we've dropped the tempo 10%. Two clean runs and you're back at 80."
   - **Buttons:** primary "Play" (with play icon, wide) and secondary "Details" (goes to Lesson detail)
   - **Hint** with a rotate icon: "Opens in landscape. Prop your phone on a stand."
5. **"Up next" section:**
   - header "Up next" with an "All lessons" link (goes to Learn)
   - 2 lesson rows. Each has a category icon tile in its category tint, a title, meta text, and a chevron:
     - "Eighth notes, steady strumming" – "Rhythm · 80 BPM · best 71%"
     - "Riff in E, palm-muted" – "Melody · 100 BPM · new"

### States

- **regular:** as above.
- **first-day:**
  - greeting "Welcome, Matyáš"; level badge "1"
  - streak "0" in a muted colour, with "day streak, start one today"; all day dots empty, Today dashed; goal "0/15"
  - session kicker "Your first session", title "Quarter notes on the click"
  - chips "60 BPM", "≈ 3 min", "Rhythm"
  - fretboard shows only the open low E string highlighted; the other strings are dimmed
  - coach text: "Four clicks, then pluck the open low E on every beat. We'll use it to find your starting tempo, so there's no wrong answer."
  - section title "After that", with rows:
    - "Chromatic warm-up 1-2-3-4" – "Scales · 70 BPM · new"
    - "Ode to Joy, single-note melody" – "Melody · 90 BPM · new"
- **offline:** regular, plus the offline banner under the header.
- **loading:** header stays; the content becomes skeleton blocks (streak strip, session card, a section title, one row). Use a gentle shimmer, or none with reduced motion.

---

## Learn

Top to bottom:

1. **Header:**
   - title "Learn" on the left, "7 of 12 done" (DM Mono) on the right
   - under it, a 12-segment progress bar; the done segments are brass
2. **Category filter chips** (horizontal, scrollable, 44 pt tall): All · Rhythm · Scales · Melody · Arpeggios. The selected chip is inverted (light background, dark text).
3. **Lesson list grouped into sections:** "In progress", "Up next", "Locked", "Done".

   Each lesson row has:
   - a category icon tile
   - the title
   - a meta line "Category · BPM", plus a difficulty indicator of 5 small marks (v2 used tiny picks)
   - a status on the right: score % (green when done), or "NEW"

   **Locked rows** use a dashed border, a lock icon tile, and an amber "How to unlock" link. Tapping it expands the unlock text under the row.

Lesson data:

| Title | Category | BPM | Difficulty | Status |
|---|---|---|---|---|
| Quarter notes on the click | Rhythm | 60 | 1 | done 96% |
| Eighth notes, steady strumming | Rhythm | 80 | 2 | in progress 71% |
| Chromatic warm-up 1-2-3-4 | Scales | 70 | 1 | done 92% |
| C major scale, open position | Scales | 72 | 2 | done 88% |
| E minor pentatonic, box 1 | Scales | "72 BPM · goal 80" | 2 | in progress 64% |
| Ode to Joy, single-note melody | Melody | 90 | 1 | done 90% |
| A minor arpeggio | Arpeggios | 70 | 2 | done 82% |
| Triplet feel | Rhythm | 70 | 3 | done 78% |
| Riff in E, palm-muted | Melody | 100 | 3 | NEW |
| A minor pentatonic, 5th position | Scales | 90 | 3 | locked: "Unlocks when you score 80% or more on E minor pentatonic, box 1. You're at 64%." |
| Syncopated strumming | Rhythm | 90 | 4 | locked: "Unlocks when you score 80% or more on Eighth notes, steady strumming. You're at 71%." |
| Cmaj7 arpeggio across 3 strings | Arpeggios | 80 | 4 | locked: "Unlocks at level 5 (Garage Band). You need 360 more XP." |

### States

- **regular:** as above. Also show one locked row expanded.
- **loading:** header and chips stay; skeleton section titles and rows below.
- **error:** header and chips stay, then an error card:
  - red alert icon
  - title "Couldn't load your progress"
  - text: "Lessons are on your phone, but your scores live online. Check your connection and try again."
  - primary button "Try again"

---

## Lesson detail (E minor pentatonic, box 1)

Top to bottom:

1. **Header row:** back button (to Learn) on the left; on the right, a "Scales" category chip and the difficulty indicator (2 of 5).
2. **Title** "E minor pentatonic, box 1". Description: "Up the box and back down, one note per eighth-note click. We check pitch, timing and clean fretting on every note."
3. **Scale diagram on wood** (flatter than the instruments):
   - 6 strings labelled e B G D A E on the left; frets 0–4, with fret numbers below
   - notes as dots with note names inside:
     - **root E** = brass
     - **other scale notes** = cream
     - **open strings** = rings
   - notes per string:
     - e: 0 (E), 3 (G)
     - B: 0 (B), 3 (D)
     - G: 0 (G), 2 (A)
     - D: 0 (D), 2 (E)
     - A: 0 (A), 2 (B)
     - E: 0 (E), 3 (G)
   - mirrors for left-handed users
   - **Legend** under the diagram: Root (E) · Scale note · Open string
4. **3 stat tiles:** "Your best" 64% · "Runs" 5 · "Goal" 80 BPM (numbers in DM Mono)
5. **"Tempo" choice:** 3 selectable tiles, each showing a BPM and a tag:
   - 64 "warm-up"
   - 72 "suggested" (selected by default)
   - 80 "goal"

   The selected tile has an amber border and a soft amber background.
6. **Tune-first nudge** (dashed row): a small tuner icon, the text "Tuned up today? A quick check makes your pitch score fair.", and an amber "Tune" action (goes to Tuner). v2 used a green pedal icon; use a small icon matching the new strobe tuner.
7. Flexible space.
8. **Primary button** "Play at 72 BPM", with a play icon. The number follows the selected tempo.

Frames to design: default (72 selected). Optionally a second frame with 64 selected.

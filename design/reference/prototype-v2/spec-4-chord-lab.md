# Spec 4 – Chord Lab (from prototype v2)

Content, copy, states and flow for Agent 4. The visual style comes from the design brief, the Tokens and the Components kit. This spec only says WHAT is on the screen, top to bottom.

390×844, dark, safe areas, tab bar (Today · Learn · Tuner · Chord Lab · You, with Chord Lab active).

**What it is:** an interactive fretboard. You place fingers, and the app names the chord, spells its notes, and suggests scales. "Strum" plays it. It works without the microphone.

**Style note:** v2 put the readout inside a blue "pedal" enclosure, using the Chord Lab tool colour blue. In v3 quiet studio, drop the enclosure. A subtle blue accent can stay for Chord Lab-specific chips ("Colour" badge, scale chips). The fretboard is real wood but flatter than the tuner and metronome: subtle grain, no heavy lighting.

---

## Main screen

Top to bottom (scrolls above the tab bar):

1. **Header:** title "Chord Lab" on the left. On the right, two pill buttons: "Clear" (secondary) and "All chords" (opens the library).
2. **Chord readout** (a dark display panel):
   - **Chord name**, large: "C"
   - **Rarity badge** next to it: "Common" (green tint), "Colour" (blue tint) or "Rare" (neutral)
   - **Long name**, muted: "C major"
   - **Chord tones** as small chips, each with the note name and its interval (DM Mono): C 1 · E 3 · G 5. The root note is brass.
   - On the right, a **round "STRUM" button** (amber, with a strings icon above the label). Disabled (grey) when no notes are placed.
3. **Fretboard (wood):**
   - **Top bar:** a position label (DM Mono): "Open position", or "Frets 5–9" when moved. Two 44 pt buttons on the right: up chevron ("Show lower frets") and down chevron ("Show higher frets"); they look dim at the ends of the range.
   - **String header row:** 6 columns labelled E A D G B e (DM Mono, cream). Under each, a mark: "○" open (cream) or "×" muted (red). Tapping toggles open/muted.
   - **Nut:** thick cream line in open position; a thin fret line otherwise.
   - **5 fret rows**, each about 52 pt tall:
     - fret number on the left
     - inlay dots at frets 3, 5, 7, 9 and 15; a double dot at 12
     - strings drawn vertically (thicker wound strings for E A D)
     - a placed finger is a ~34 pt dot with the note name: brass for the chord root, cream for others
     - each cell is a 44 pt tap target
   - Columns mirror for left-handed users.
   - On "Strum", the sounding strings vibrate briefly (no animation with reduced motion).
4. **Helper text** (muted): "Tap a fret to place a finger. Tap a dot to lift it and let the string ring open. Tap ○ or × above the nut to open or mute a string."
5. **Quick chords:** a horizontally scrolling row of 44 pt chips: C · G · D · Am · Em · E7 · Dm7 · F · Bm · Cmaj7 · E♭
6. **Theory card:**
   - "Also reads as" with chips for alternative names, or the text "No other common reading"
   - "Scales that fit" with blue-tint chips. For C major: "C major", "C major pentatonic", "C Mixolydian", "C Lydian" (up to 6), or a muted fallback text.

### States to design

**default:** C major loaded (x32010).
- Strings: E muted (×); A fret 3 (C, brass root); D fret 2 (E); G open (○); B fret 1 (C, brass root); e open (○).
- Readout: "C", "Common", "C major", tones C 1 · E 3 · G 5.
- Also reads as: no other common reading. Scales: C major, C major pentatonic, C Mixolydian, C Lydian.

**empty** (after Clear):
- name "—", badge "Empty", long name "Tap the fretboard to place fingers"
- no tones; Strum disabled
- all strings muted (×)
- scales text "Add some notes first"

**colour chord** (optional): Cadd9, loaded from All chords as x35753, at position "Frets 3–7". It shows name "Cadd9", badge "Colour", "C add 9", and tones C 1 · D 9 · E 3 · G 5.

---

## All chords (full-screen sheet)

Opens over Chord Lab.

1. **Header:**
   - close button (×) on the left
   - title "All chords", subtitle "Pick a root, then a shape to load it on the neck"
   - **Root picker:** a 6×2 grid of 44 pt buttons: C D♭ D E♭ E F F♯ G A♭ A B♭ B. The selected one is highlighted with the Chord Lab accent.
2. **Scrolling list grouped into sections.** Each row has the chord name (large) and a label (small, muted). On the right are 1–2 voicing buttons; each shows "open" or "fr N" (DM Mono) and a sub-label "root on E" or "root on A".

Groups (for root C):
- **Basic:** C major · Cm minor · C7 dominant 7th · C5 power chord
- **Sevenths:** Cmaj7 major 7th · Cm7 minor 7th · Cm7♭5 half-diminished · Cdim7 diminished 7th
- **Suspended and added:** Csus2 · Csus4 · Cadd9 · C6 major 6th · Cm6 minor 6th
- **Diminished, augmented, altered:** Cdim · Caug · C9 dominant 9th · C7♭9 · C7♯9

Example voicing buttons for C major: "fr 3 / root on A" and "fr 8 / root on E".

Tapping a voicing loads it on the neck and closes the sheet.

Frames to design: Chord Lab / regular / default, Chord Lab / regular / empty, Chord Lab / All chords.

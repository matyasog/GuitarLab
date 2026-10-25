# Spec 3 – Progress and settings (from prototype v2)

Content, copy, states and flow for Agent 3. The visual style comes from the design brief, the Tokens and the Components kit. This spec only says WHAT is on each screen, top to bottom.

All screens: 390×844, dark, safe areas.
- **You** has the tab bar (Today · Learn · Tuner · Chord Lab · You, with You active).
- **Results** and **Settings** have no tab bar.

Shared data (keep consistent):
- user "Matyáš", level 4 "Bedroom Player"
- 1,240 XP before the session; 1,600 XP needed for level 5 "Garage Band"
- streak 12 days, which becomes 13 after this session
- lesson "E minor pentatonic, box 1", old best 64%

Gamification icon note: v2 used guitar-pick shapes for the level badge, rank ladder, achievements, difficulty and confetti. Keep the pick as the gamification motif if it fits, but make it refined (a brass or celluloid material look, used sparingly), not cartoon.

---

## Results (after a practice run)

Top to bottom:

1. **Top row:** "E minor pentatonic · 72 BPM" (small, muted) on the left. In the personal-best state only, a brass "PERSONAL BEST" stamp sits on the right (slightly rotated). It animates in once; it's static with reduced motion.
2. **Save-failed banner** (save-failed state only):
   - red-tinted, with the text "**Couldn't save this run.** It's kept on your phone and we'll retry automatically."
   - a "Retry" button on the right (it reads "Saved" after a retry)
3. **Score meter:** a semicircle gauge from 0 to 100, with tick marks every 10, the "0" and "100" labels, and a green zone from about 80 to 100. A needle points at the score and swings in once. This is a good place for a refined, slightly realistic gauge (a small analog meter), but much quieter than the tuner.
4. **Big score** "86%" with a line under it (see the states table).
5. **Two tiles:**
   - **XP:** "+120 XP" (brass, DM Mono), an XP progress bar (brass), and "240 XP to Garage Band"
   - **Streak:** "13 days" (brass), a green check line "Today's 15 min done", and "Streak extended"
6. **Stats list** (one card, 4 rows, label left and value right in DM Mono): Clean notes · Timing · Pitch · Buzz / muted. Timing also shows the previous value, "(was +64)", in green when improved.
7. **Coach card** (with a small brass icon): a bold head sentence followed by the body text.
8. Flexible space.
9. **Two buttons side by side:** "Run it again" and "Done" (goes to Today). Normally "Done" is primary. In the rough state, the first button reads "Try at 64 BPM" and becomes primary, and "Done" becomes secondary.

**Personal best only:** a short confetti burst of small falling picks in mixed colours, played once, never with reduced motion. In quiet studio, keep it subtle and brief, or replace it with a more elegant moment.

### States

| | personal-best | normal | rough |
|---|---|---|---|
| Score | 86% | 61% | 38% |
| Line under score | 22 points above your old best of 64% | 3 points under your best of 64% | A tough one. Everyone has those. |
| XP | +120 | +80 | +40 |
| Clean notes | 20 / 23 | 15 / 23 | 9 / 23 |
| Timing | +27 ms (was +64, green) | +48 ms (was +64, green) | +92 ms (was +64, muted) |
| Pitch | ±7 cents | ±9 cents | ±14 cents |
| Buzz / muted | 2 / 1 | 3 / 2 | 6 / 3 |
| Coach head | Huge timing jump. | Steady run. | Let's make it easier. |
| Coach body | One more run above 90% and we move you up to 80 BPM. Three of your late notes were on the B string, so watch that switch. | Your timing is creeping closer to the click. Another run at 72 BPM should push you past 64%. | Most misses came after the string changes. One warm-up run at 64 BPM usually fixes that. You still earned XP for showing up. |
| First button | Run it again (secondary) | Run it again (secondary) | Try at 64 BPM (primary) |
| Stamp and confetti | yes | no | no |

- **save-failed:** the personal-best content plus the save-failed banner (no confetti needed in the frame).
- The XP line under the bar is 1600 − 1240 − earned XP: "240 XP to Garage Band" (+120), "280 XP to Garage Band" (+80), "320 XP to Garage Band" (+40). The bar shows (1240 + earned XP) / 1600.

Frames to design: personal-best, normal, rough, save-failed.

---

## You (Profile)

Top to bottom (scrolls above the tab bar):

1. **Header:** the name "Matyáš" as the title; on the right, a settings button (sliders icon) that goes to Settings.
2. **Rank card:**
   - a level badge (brass) showing "4"
   - next to it, the rank name "Bedroom Player", an XP bar (brass, 77% full), and "1,240 / 1,600 XP to level 5" (DM Mono)
   - below, a **rank ladder** of 4 steps. Each step has an icon, a name and a level range:
     - Bedroom Player · Lv 1–4 (current: filled brass, bold)
     - Garage Band · Lv 5–8 (next: outlined, lighter)
     - Opening Act · Lv 9–12 (future: dim)
     - Headliner · Lv 13+ (future: dim)
3. **3 stat tiles:** "12" day streak (brass) · "7/12" lessons done · "9h 40" practised
4. **"Your mix" card** (subtitle "last 20 sessions"):
   - 3 skill meters styled as **mixing-desk faders**, each with a value on top, a fader track, a fader cap at the level, a name, and a detail line:
     - Rhythm 72 – "avg 41 ms off" (Rhythm tint)
     - Clean tone 64 – "9 ¢ · 11% buzz" (Scales tint)
     - Speed 58 – "top 92 BPM" (Arpeggios tint)
   - below them: "Speed is your quietest channel. The speed trainer on the metronome is built for exactly that."

   The faders fit "quiet studio" perfectly. They can be the one slightly realistic element on this screen (machined fader caps).
5. **"Accuracy, last 4 weeks" card:**
   - "62% → 80%" in green, top right
   - a simple line chart rising from about 62 to 80, with a dot on the last point
   - x labels "14 Sep" and "today"
6. **"Pick collection"** with "4 of 12" on the right: a grid of 6 achievement badges (3 per row), each with a short glyph and a name:
   - earned (filled): 7-day streak "7" · Perfect pitch run "±0" · 120 BPM club "120" · First 100% "100"
   - not earned (dashed outline, dim): 30-day streak "30" · Barre chord boss "F"

### States

- **regular:** as above.
- **empty** (new player):
  - level "1", XP bar empty, "0 / 100 XP to level 2"
  - tiles: "0" day streak (muted) · "0/12" lessons done · "0m" practised
  - instead of "Your mix" and the accuracy chart, show an **empty card** (dashed border):
    - a small illustration of 3 faders at zero
    - title "Your mix starts at zero"
    - text: "Play three sessions and we'll show your rhythm, clean tone and speed here, plus how your accuracy changes week by week."
    - primary button "Play your first session"
  - pick collection "0 of 12", all 6 badges not earned

---

## Settings

Header: back button (to You) and the title "Settings". No tab bar. Grouped cards with section titles (muted).

**Playing**
- **Strumming hand:** segmented "Right hand" / "Left hand". Helper: "Left mirrors every fretboard, chord shape and the tuner headstock."
- **Guitar:** segmented "Acoustic" / "Electric"
- **Headstock:** segmented "3 + 3" / "6 in line". Helper: "Sets which way the tuner tells you to turn each peg."
- **Daily goal:** segmented "5 min" / "10" / "15" / "20" (15 selected, DM Mono). Helper: "Hitting it each day keeps your streak going."
- **Reference pitch:** label, plus sub "Standard is A4 = 440 Hz". On the right, a stepper: "−" button, "440 Hz" (DM Mono), "+" button. Range 430–450.

**Listening**
- **Input sensitivity:** label with "60%" on the right; a slider; helper: "Raise it for a quiet acoustic, lower it next to a loud amp."
- **Noise gate:** switch (on), sub "Ignore sounds quieter than your guitar"
- **Row** "Run an input check" with a chevron (goes to Input problems)

**Feedback** (4 switch rows, all on)
- Feel the beat – "Phone taps on every metronome beat"
- Visual pulse – "Screen edge flashes on the beat (up to 170 BPM)"
- Count-in clicks – "Four clicks before each run"
- Sound effects – "Hit sounds, streak and level-up"

**Account**
- Email – "[your email]" (muted, right)
- "Sign out" (red text row)

Switches use one style everywhere: amber when on.

Frames to design: one Settings frame. It can be taller than 844 to show everything, since it scrolls.

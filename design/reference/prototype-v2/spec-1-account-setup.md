# Spec 1 – Account and setup (from prototype v2)

Content, copy, states and flow for Agent 1. The visual style comes from the design brief, the Tokens and the Components kit. This spec only says WHAT is on each screen, top to bottom.

All screens: 390×844, dark, safe area at top (status bar) and bottom (home indicator). No tab bar on these screens.

---

## Sign in (Main)

Top to bottom:
1. **Hero art.** v2 had a flat fretboard strip with strings that "pluck" once on load, plus a cartoon amber pick. Replace it with something calmer that fits quiet studio, for example a close, subtle wood-and-strings detail. No cartoon pick. If anything animates, it's one gentle pluck, and it respects reduced motion.
2. **App name** "GuitarLab". Subtitle: "Plug in. Play. It listens and tells you what to fix."
3. Flexible space.
4. **Form:**
   - Label "Email", placeholder "you@example.com"
   - Label "Password", with a "Forgot password?" text button (amber) on the right of the label row. Placeholder "Your password". "Show"/"Hide" text button inside the field.
   - When "Forgot password?" is tapped, green helper text appears under the password field: "Reset link sent. Check your inbox (and spam, just in case)."
   - Primary button "Sign in"
   - Secondary button "Continue with Google"
5. Footer text: "New here? **Create an account**" (link to Sign up)

States to design: default, forgot-password message shown.

---

## Sign up (Register)

Top to bottom:
1. Header row: back button (to Sign in). v2 put a small decorative fretboard strip next to it; drop it or replace it with a quiet detail.
2. Title "Join the band". Subtitle: "We keep your streak, scores and progress safe across devices."
3. Secondary button "Sign up with Google"
4. Divider with text "or with email"
5. **Form:**
   - "What should we call you?", placeholder "First name or nickname"
   - "Email", placeholder "you@example.com". Validated when the field loses focus. Error (red, with icon): "That doesn't look like an email. Try you@example.com"
   - "Password", placeholder "At least 8 characters", with "Show"/"Hide". Below it, two live rules that turn green with a check when met: "8+ characters", "A number"
6. Flexible space.
7. Primary button "Create account" (goes to Onboarding)

States to design: empty, email error plus one password rule met.

---

## Onboarding (4 steps)

Shared header on every step:
- back button (disabled on step 1)
- a progress bar of 4 segments (done and current segments amber)
- step counter "1/4" in DM Mono

Primary button at the bottom: "Continue". It's disabled until a choice is made. On step 3 it reads "Allow microphone".

### Step 1 – Level
- Title "Where are you at?" Subtitle: "We'll pick your first exercises and starting tempo. You can change this later."
- 4 selectable option cards (radio). Each has a small 4-bar level icon, a title and a subtitle:
  - Brand new – "A few weeks in, or never held one"
  - Campfire chords – "I know a handful of open chords"
  - Playing songs – "I can get through whole songs"
  - Gigging – "I play with other people or on stage"
- Selected card: amber border and soft amber background.
- Text button below Continue: "Skip, I'll pick later"

### Step 2 – Your guitar
- Title "Your guitar". Subtitle: "Acoustic and electric guitars sound very different to a microphone, so we tune the listening to yours."
- 2 large option cards side by side, "Acoustic" and "Electric", each with an illustration. v2 used flat cartoon guitar shapes; replace them with refined, realistic-leaning but simple illustrations.
- "Which hand strums?" segmented control: "Right hand" / "Left hand". Helper text: "Left-handed mirrors every fretboard and chord diagram in the app."
- "Where are the tuning pegs?" segmented control: "3 each side" / "All 6 on one side"

### Step 3 – Microphone
- Large circular badge with a microphone icon (amber)
- Title "Let us hear you". Subtitle: "GuitarLab needs the microphone to hear your notes, timing and buzz."
- 3 reassurance lines, each with a green check:
  - "Listens only while a tool or lesson is open."
  - "Sound is analysed on your phone. Only scores are saved."
  - "A green dot at the top shows whenever it's listening."
- Primary button "Allow microphone". Text link below: "Not now, I'll look around first" (goes to Today).

### Step 4 – Low E check
- Title "Pluck your low E". Subtitle: "The thickest string, open. Let it ring. We'll set the input level from it."
- Card containing:
  - top row: green "Listening" dot and label on the left, "Input level" (DM Mono) on the right
  - a 16-segment input level meter (green, then amber, then red)
  - a large note letter with a status line and a detail line
- Link: "Not picking anything up?" (goes to Input problems)
- Bottom: a disabled-looking bar "Waiting for the low E…" until done, then the primary button "Let's play" (goes to Today)
- The check progresses through three sub-states:
  - waiting: note "–", status "Waiting for sound", detail "Room is quiet"
  - hearing: note "E", status "Hearing you…", detail "Hold it, measuring"
  - done: note "E" in green, status "Clean signal. You're set." in green, detail "E2 · 82.4 Hz · level good"

Frames to design: one per step, plus step 4 in "waiting" and "done".

---

## Input problems ("Input check")

Header: back button and the title "Input check".

Top to bottom:
1. **Meter card:**
   - top row: mic status dot and label on the left, a DM Mono note on the right
   - 16-segment input level meter
   - a vertical white "room noise" marker line on the meter (not shown in the denied state)
   - scale labels under the meter: "silent" · "room noise" · "too loud"
2. **Title and lead text**, then **3 numbered tips** (numbers in small circles, DM Mono).
3. Flexible space.
4. Primary button (fix action) and a text link "Use Chord Lab without the mic".

The three problem states:

| State | Mic label / dot | Meter | Title | Lead | Tips | Primary button |
|---|---|---|---|---|---|---|
| **denied** | "Microphone blocked", grey dot, "no signal" | empty, no noise marker | The mic is switched off | GuitarLab can't hear you, so the tuner, metronome timing and lessons can't score anything. | 1. Open your phone's Settings, then Apps, then GuitarLab. 2. Under Permissions, set Microphone to "Allow while using the app". 3. Come back here. We'll check the signal straight away. | Open phone settings |
| **quiet** | "Listening", green dot, "input level" | low (3–5 of 16), marker at 4 | We can barely hear you | Your notes arrive just above the room noise, so quiet notes will be missed. | 1. Put the phone within an arm's length of the soundhole or amp. 2. Disconnect Bluetooth headphones, so the phone uses its own mic. 3. Electric with no amp? Lay the phone on the guitar's body. | Boost input sensitivity |
| **noisy** | "Listening", green dot, "input level" | high (7–11), marker at 9 | It's loud in here | Background noise is close to your guitar's level. Timing and buzz detection will guess wrong. | 1. Turn off the TV, fan or music in the room. 2. Move the phone closer to the guitar than to the noise. 3. Turn on the noise gate below to ignore anything quieter than the line. | Turn on noise gate and re-check |

**Fixed state** (after the primary button is tapped):
- meter healthy (9–12), marker at 3
- title "Loud and clear" in green
- text: "Your signal sits well above the room noise now. Scores will be accurate."
- primary button "Back to playing" (goes to Today)

Frames to design: denied, quiet, noisy, fixed.

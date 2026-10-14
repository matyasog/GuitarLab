---
name: guitarlab-design
description: Design brief for GuitarLab, a React Native guitar practice app. Use for every design request in this .pen file.
---

# GuitarLab design brief (v3, "analog instrument")

You are redesigning GuitarLab, a mobile guitar practice app: tuner, metronome, Chord Lab, lessons, gamification (XP, streaks). It is a school graduation project and will be built in **React Native (Expo)**, so every design decision must be buildable and smooth on a mid-range Android phone.

The previous prototype ("v2 pedalboard", attached as HTML + README) defines the **screens, content, states and copy**. Keep all of that. What changes is the **visual language**: v2 looks cartoonish (flat saturated enamel slabs, thick bottom borders as fake depth, flat dot screws, heavy uppercase display type everywhere). v3 must feel real, calm and professional.

## 1. Two visual modes

**A. Instruments (Tuner and Metronome only): "analog instrument" realism.**
Physical objects rendered convincingly: wood, brass, cream enamel, glass, backlit displays. These are the hero moments of the app.

**B. Everything else: "quiet studio".**
Matte warm-graphite surfaces, hairline borders, restrained colour, refined typography, small radii, generous spacing. No textures, no glows except tiny status LEDs. It should feel like the calm room the instruments sit in, never competing with them.

## 2. Realism rules (instruments)

- One light source, top-left, applied consistently: highlights on top-left edges, shadows falling bottom-right.
- Depth comes from soft shadows, gradients and specular highlights, never from thick borders or outlines.
- Colour comes from light: bodies are wood, brass, cream or black; only displays, LEDs and the strobe glow.
- Proportions copied from real objects (a Peterson-style strobe tuner, a Wittner-style pyramid metronome).
- Labels are small, crisp, letter-spaced silkscreen or engraving text, not big poster type.
- Materials: dark walnut or mahogany wood with subtle grain, brushed brass, cream enamel dial, black anodized metal, glass with a faint diagonal reflection.
- No cartoon illustration, no outlines around everything, no pure #000000, no neon.

## 3. Tuner (strobe)

Housing: a compact wooden case with a brass bezel and a glass window.

Inside the window, a strobe display: 3 horizontal bands of alternating lit and dark segments, warm amber light on a near-black background. Behaviour (show it as static states with a subtle motion hint):
- flat: bands drift left
- sharp: bands drift right
- the further off pitch, the faster they move
- in tune: bands freeze and a green "lock" lamp lights

The strobe is precise but unfamiliar to beginners, so ALWAYS also show:
- the big note name with its octave
- the cents value (DM Mono) and Hz
- the plain-language instruction from v2 ("The A string is 12 cents flat. Turn its peg clockwise…")

Keep from v2:
- Tuner/Metronome switch at the top
- "Listening" indicator
- A4 reference (A4 = 440 Hz)
- AUTO/MANUAL string detection
- headstock with 6 tappable pegs (3+3 and 6-in-line variants), with the active peg highlighted and a turn arrow

Restyle the headstock realistically (wood grain, metal tuning machines), but keep it simpler than the strobe.

States to design: no signal ("Play a string"), flat, sharp, in tune, manual string selected.

## 4. Metronome (pyramid)

A front view of a pyramid metronome:
- mahogany or black-grain wooden body
- cream enamel tempo scale with Italian markings (Largo … Presto) and BPM numbers
- a brass pendulum rod with a sliding weight positioned at the current BPM
- the pendulum swings about ±25° around a pivot near the bottom

Keep from v2:
- BPM readout (large, DM Mono)
- ±1 and ±5 buttons, TAP, time signature (4/4, 3/4, 2/4, 6/8), subdivision, sound
- big play/stop control
- beat indicator lamps (beat 1 accented in amber)
- Speed trainer row
- "Your strums vs the click" timing histogram
- the edge-flash rules: no flash above 170 BPM, with reduced motion, or when Visual pulse is off

With reduced motion the pendulum stays still and only the beat lamps show the beat.

The controls below the object use the quiet-studio style, with a slightly tactile touch (machined knob texture on the main tempo control is welcome).

States to design: stopped, playing on beat 1 (accent), playing on another beat, speed trainer on, above 170 BPM note.

## 5. Quiet studio (all other screens)

Screens: Sign in, Sign up, Onboarding, Input problems, Today, Learn, Lesson detail, Results, Chord Lab, You (profile), Settings. Practice is landscape and comes later.

- Keep the warm dark palette, but calmer: fewer saturated fills, more tonal surfaces.
- Retire Big Shoulders Display from general UI; it reads as poster or cartoon. Titles in Archivo, semibold, sentence case. Propose 2 Google Fonts options for instrument silkscreen labels.
- Keep DM Mono for all numbers (BPM, cents, ms, XP).
- Colour roles from v2 stay exactly:
  - **amber** = act / now (primary buttons, active tab, selected, beat 1, turn arrow)
  - **brass** = achievement (streak, XP, personal best, root notes)
  - **green** = correct or in tune; **red** = error or miss
- Fretboards in Chord Lab and Lesson detail may use real wood, but flatter than the instruments.
- Dark mode only for now.

## 6. Built for React Native performance (important)

Design every instrument as separate, clearly named layers so the code can bake static parts into images and animate only what moves:
1. `static-body`: everything that never moves (case, wood, scale, labels). Will become one image.
2. `moving-*`: the parts that animate (strobe bands, pendulum + weight, lamps). Mark each pivot point. Maximum 3 moving layers per instrument.
3. `glass-overlay`: static reflection on top.

Other performance rules:
- No blur or heavy shadow effects on moving parts.
- In quiet-studio screens, use at most one soft shadow per card and none on list rows.
- Textures (wood grain) are images, not dozens of vector strokes.
- Each instrument lives in a fixed aspect-ratio frame so it can scale as one vector or image.

## 7. Layout and responsiveness

- Use auto layout (flex) everywhere except inside instrument artwork. No absolute positioning of UI controls.
- Design each tool screen at two sizes:
  - **regular** 390 × 844 (iPhone 14/15)
  - **compact** 360 × 640 (small Android, iPhone SE class)
- On compact, keep the instrument and readouts and shrink or collapse the secondary content. On the tuner, the headstock becomes a row of 6 string buttons.
- Respect safe areas: status bar at top, home indicator at bottom, tab bar of 84 pt including the inset.
- The instruments scale; text and spacing do not.

## 8. Tokens (define as pen.dev variables, names must map to code)

- **color.\***: keep the v2 token names where the role is unchanged (bg, surface, surface-2, line, text, text-2, muted, amber, brass, green, red…), and add material tokens (wood, wood-dark, brass-metal, enamel-cream, strobe-glow, glass).
- **space.\***: 4, 8, 12, 16, 20, 24, 32
- **radius.\***: 8 (chips), 12 (controls, rows), 16 (cards), 999 (pills). Instruments use real-object corners.
- **type.\***: 12, 14, 16, 20, 24, 32, 44, 64, 96. Nothing below 12.
- Never use raw values in components; always reference variables.

## 9. Accessibility

- Touch targets at least 44 × 44 pt.
- Text contrast at least 4.5:1 against its actual surface, including text on wood and enamel.
- Layouts must survive larger system font sizes. Show one screen at 130% text.
- Never rely on colour alone: in tune also shows the lock lamp and text; beat 1 is also larger.

## 10. Working rules

- Do not invent new features, screens or flows. Do not change copy unless asked. If something is unclear, stop and ask.
- Name every frame like `Tuner / regular / in-tune` and every layer meaningfully.
- Work in small steps. Finish the requested step, then summarise what you made and list open questions.

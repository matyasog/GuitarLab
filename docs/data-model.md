# Firestore data model

> **Status (2026-10-26):** `users/{uid}` is implemented (created on sign-up by `src/firebase/users.ts`, type `src/types/user.ts`, rules in `firestore.rules`). The subcollections are still a draft until Phase 6. Update this file whenever the model changes.

## Principles

- Everything a user owns lives under `users/{uid}`, so one security rule ("only the signed-in owner") covers it.
- Static content (lessons, chords, achievement definitions) is **not** in Firestore; it ships with the app in `src/data/`. Firestore stores only the user's progress.
- No raw audio ever. Sessions store results only.
- Dates for streaks are stored as **local calendar day strings** (`"2026-10-25"`) computed on the phone in the user's time zone, plus the time zone name, so a late-evening session counts for the day the user experienced.
- Timestamps use Firestore `serverTimestamp()` where possible.
- Mock audio sessions are never written (unless the dev flag `EXPO_PUBLIC_SAVE_MOCK_SESSIONS=true` is set, and then they are marked `source: "mock"`).

## Collections

```
users/{uid}                          profile, settings, progress summary
users/{uid}/days/{yyyy-mm-dd}        one doc per practised day (daily goal, streak)
users/{uid}/sessions/{sessionId}     one doc per finished tool session or lesson run
users/{uid}/lessons/{lessonId}       best score and runs per lesson
users/{uid}/achievements/{achId}     earned achievements
```

### `users/{uid}`

| Field | Type | Notes |
|---|---|---|
| `displayName` | string | "What should we call you?" (1–40 chars) |
| `createdAt` | timestamp | server time |
| `timeZone` | string | IANA name, e.g. `"Europe/Prague"`, updated on app start |
| `onboarding` | map | `{ level: "brand-new" \| "campfire" \| "songs" \| "gigging" \| null, completedAt: timestamp \| null }` `level` is written by onboarding step 1 (null = skipped); `completedAt` (server time) when onboarding ends. While it is null the app shows onboarding. |
| `settings` | map | see below |
| `progress` | map | summary shown on Today and You, see below |

`settings`:

| Field | Type | Default |
|---|---|---|
| `hand` | `"right"` \| `"left"` | `"right"` |
| `guitar` | `"acoustic"` \| `"electric"` | `"acoustic"` |
| `headstock` | `"3+3"` \| `"6-in-line"` | `"3+3"` |
| `dailyGoalMin` | 5 \| 10 \| 15 \| 20 | 15 |
| `a4Hz` | number (430–450) | 440 |
| `inputSensitivity` | number 0–100 | 60 |
| `noiseGate` | boolean | false |
| `feelTheBeat` | boolean | false |
| `visualPulse` | boolean | true |
| `countIn` | boolean | true |
| `soundEffects` | boolean | true |

`progress`:

| Field | Type | Notes |
|---|---|---|
| `xp` | number | total XP; level is computed from it, not stored |
| `streak` | number | current streak in days |
| `bestStreak` | number | |
| `lastGoalDay` | string \| null | last day the daily goal was met (`"2026-10-25"`) |
| `practiceSec` | number | total practice time |
| `lessonsDone` | number | lessons with best score ≥ 80 % |

Example:

```json
{
  "displayName": "Matyáš",
  "createdAt": "2026-10-25T18:02:11Z",
  "timeZone": "Europe/Prague",
  "onboarding": { "level": "campfire", "completedAt": "2026-10-25T18:04:40Z" },
  "settings": {
    "hand": "right", "guitar": "acoustic", "headstock": "3+3",
    "dailyGoalMin": 15, "a4Hz": 440, "inputSensitivity": 60,
    "noiseGate": false, "feelTheBeat": false, "visualPulse": true,
    "countIn": true, "soundEffects": true
  },
  "progress": {
    "xp": 1240, "streak": 12, "bestStreak": 12, "lastGoalDay": "2026-10-24",
    "practiceSec": 34800, "lessonsDone": 7
  }
}
```

The email address is **not** copied here; it comes from Firebase Auth (`auth.currentUser.email`).

### `users/{uid}/days/{yyyy-mm-dd}`

| Field | Type | Notes |
|---|---|---|
| `practiceSec` | number | sum of session durations that day |
| `goalMin` | number | daily goal on that day (so changing the goal doesn't rewrite history) |
| `goalMet` | boolean | `practiceSec >= goalMin × 60` |
| `xp` | number | XP earned that day |

Example (`users/abc123/days/2026-10-25`): `{ "practiceSec": 960, "goalMin": 15, "goalMet": true, "xp": 160 }`

### `users/{uid}/sessions/{sessionId}`

| Field | Type | Notes |
|---|---|---|
| `kind` | `"metronome"` \| `"chordlab"` \| `"tuner"` \| `"lesson"` | |
| `source` | `"real"` \| `"mock"` | mock only with the dev flag |
| `startedAt` | timestamp | |
| `durationSec` | number | |
| `day` | string | local day `"yyyy-mm-dd"` |
| `xp` | number | XP awarded for this session |
| `details` | map | per kind, see below |

`details` by kind:
- metronome: `{ bpmStart, bpmEnd, timeSig, subdivision, speedTrainer: boolean }`
- chordlab: `{ chordsStrummed: number, distinctChords: number }`
- lesson: `{ lessonId, bpm, score, cleanNotes, totalNotes, timingMs, pitchCents, buzz, muted, personalBest: boolean }`

Example:

```json
{
  "kind": "metronome", "source": "real", "startedAt": "2026-10-25T18:10:00Z",
  "durationSec": 420, "day": "2026-10-25", "xp": 30,
  "details": { "bpmStart": 72, "bpmEnd": 80, "timeSig": "4/4", "subdivision": "eighth", "speedTrainer": true }
}
```

### `users/{uid}/lessons/{lessonId}`

| Field | Type | Notes |
|---|---|---|
| `bestScore` | number 0–100 | |
| `runs` | number | |
| `lastBpm` | number | |
| `updatedAt` | timestamp | |

Status (in progress / done / locked) is computed in the app from `bestScore` and the unlock rules in `src/data/lessons.ts`.

Example (`users/abc123/lessons/em-pentatonic-box-1`): `{ "bestScore": 64, "runs": 5, "lastBpm": 72, "updatedAt": "…" }`

### `users/{uid}/achievements/{achId}`

| Field | Type |
|---|---|
| `earnedAt` | timestamp |

Example (`users/abc123/achievements/streak-7`): `{ "earnedAt": "2026-10-20T19:31:00Z" }`

## Who can read and write

| Path | Read | Write |
|---|---|---|
| `users/{uid}` | owner only | owner only; `createdAt` cannot change after creation |
| `users/{uid}/**` | owner only | owner only, basic type/size checks |
| anything else | nobody | nobody |

The rules live in `firestore.rules` in the repo root (written in step 2.2, compiled with `npx firebase-tools deploy --only firestore:rules --dry-run`). In short:

- `users/{uid}`: only the signed-in owner can read it. **Create** also requires `displayName` to be a string of 1–40 characters and `createdAt` to be the server's time (`serverTimestamp()`). **Update** can't change `createdAt`. **Delete** is allowed for the owner (for account deletion later).
- `users/{uid}/{subcollection}/…` (days, sessions, lessons, achievements): owner only. Field checks are added when these collections are built in Phase 6.
- Anything else: denied (Firestore denies everything that no rule allows).

**Known limit (for the thesis):** XP and streaks are calculated on the phone and written by the app, so a user who edits requests by hand could give themselves XP. Rules can only check types and ownership, not "was this earned". Doing it properly needs Cloud Functions, which require the paid Blaze plan. For a single-user school project this is an accepted trade-off.

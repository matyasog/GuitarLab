# GuitarLab

A mobile app for practising guitar: strobe tuner, pyramid metronome, Chord Lab, lessons, and progress tracking with XP, streaks and achievements.
Graduation project (maturitní práce), 2026/27.

Built with React Native, Expo (SDK 57), Expo Router, TypeScript and Firebase (Auth + Firestore).

## Run it

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and fill in the Firebase web config.
3. Start the dev server: `npx expo start`, then scan the QR code with Expo Go on the phone (log in to the same Expo account in the CLI and in Expo Go).

## Docs

- `docs/plan.md`: development plan and progress
- `docs/decisions.md`: technical decisions and why they were made
- `docs/features.md`: features and their status
- `docs/data-model.md`: Firestore data model and security rules
- `docs/design-map.md`: index of the design file `design/guitarlab.pen`

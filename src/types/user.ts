// Shape of the user profile document users/{uid}. Documented in docs/data-model.md.

export type OnboardingLevel = 'brand-new' | 'campfire' | 'songs' | 'gigging';

export type UserSettings = {
  hand: 'right' | 'left';
  guitar: 'acoustic' | 'electric';
  headstock: '3+3' | '6-in-line';
  dailyGoalMin: 5 | 10 | 15 | 20;
  a4Hz: number;
  inputSensitivity: number;
  noiseGate: boolean;
  feelTheBeat: boolean;
  visualPulse: boolean;
  countIn: boolean;
  soundEffects: boolean;
};

export type UserProgress = {
  xp: number;
  streak: number;
  bestStreak: number;
  lastGoalDay: string | null;
  practiceSec: number;
  lessonsDone: number;
};

export type UserProfile = {
  displayName: string;
  timeZone: string;
  onboarding: { level: OnboardingLevel | null; completedAt: unknown | null };
  settings: UserSettings;
  progress: UserProgress;
  // Firestore timestamp, set by the server.
  createdAt: unknown;
};

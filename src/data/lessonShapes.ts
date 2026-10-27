import type { FretShape } from '@/types/lesson';

// Fretboard shapes shown on Lesson detail. Fret 0 = open string. Written by hand (step 3.5);
// the music theory module (step 5.1) can check the note names later.

// From "Lesson detail / regular / default" in the design.
export const emPentatonicBox1: FretShape = {
  root: 'E',
  notes: [
    { string: 'e', fret: 0, name: 'E' },
    { string: 'e', fret: 3, name: 'G' },
    { string: 'B', fret: 0, name: 'B' },
    { string: 'B', fret: 3, name: 'D' },
    { string: 'G', fret: 0, name: 'G' },
    { string: 'G', fret: 2, name: 'A' },
    { string: 'D', fret: 0, name: 'D' },
    { string: 'D', fret: 2, name: 'E' },
    { string: 'A', fret: 0, name: 'A' },
    { string: 'A', fret: 2, name: 'B' },
    { string: 'E', fret: 0, name: 'E' },
    { string: 'E', fret: 3, name: 'G' },
  ],
};

// Frets 1-2-3-4 on every string, one finger per fret. No root: it is a finger exercise.
export const chromaticWarmUp: FretShape = {
  notes: [
    { string: 'e', fret: 1, name: 'F' },
    { string: 'e', fret: 2, name: 'F♯' },
    { string: 'e', fret: 3, name: 'G' },
    { string: 'e', fret: 4, name: 'G♯' },
    { string: 'B', fret: 1, name: 'C' },
    { string: 'B', fret: 2, name: 'C♯' },
    { string: 'B', fret: 3, name: 'D' },
    { string: 'B', fret: 4, name: 'D♯' },
    { string: 'G', fret: 1, name: 'G♯' },
    { string: 'G', fret: 2, name: 'A' },
    { string: 'G', fret: 3, name: 'A♯' },
    { string: 'G', fret: 4, name: 'B' },
    { string: 'D', fret: 1, name: 'D♯' },
    { string: 'D', fret: 2, name: 'E' },
    { string: 'D', fret: 3, name: 'F' },
    { string: 'D', fret: 4, name: 'F♯' },
    { string: 'A', fret: 1, name: 'A♯' },
    { string: 'A', fret: 2, name: 'B' },
    { string: 'A', fret: 3, name: 'C' },
    { string: 'A', fret: 4, name: 'C♯' },
    { string: 'E', fret: 1, name: 'F' },
    { string: 'E', fret: 2, name: 'F♯' },
    { string: 'E', fret: 3, name: 'G' },
    { string: 'E', fret: 4, name: 'G♯' },
  ],
};

// Every C major note in open position (frets 0–3).
export const cMajorOpen: FretShape = {
  root: 'C',
  notes: [
    { string: 'e', fret: 0, name: 'E' },
    { string: 'e', fret: 1, name: 'F' },
    { string: 'e', fret: 3, name: 'G' },
    { string: 'B', fret: 0, name: 'B' },
    { string: 'B', fret: 1, name: 'C' },
    { string: 'B', fret: 3, name: 'D' },
    { string: 'G', fret: 0, name: 'G' },
    { string: 'G', fret: 2, name: 'A' },
    { string: 'D', fret: 0, name: 'D' },
    { string: 'D', fret: 2, name: 'E' },
    { string: 'D', fret: 3, name: 'F' },
    { string: 'A', fret: 0, name: 'A' },
    { string: 'A', fret: 2, name: 'B' },
    { string: 'A', fret: 3, name: 'C' },
    { string: 'E', fret: 0, name: 'E' },
    { string: 'E', fret: 1, name: 'F' },
    { string: 'E', fret: 3, name: 'G' },
  ],
};

// A, C and E across the open A minor chord shape.
export const aMinorArpeggio: FretShape = {
  root: 'A',
  notes: [
    { string: 'e', fret: 0, name: 'E' },
    { string: 'B', fret: 1, name: 'C' },
    { string: 'G', fret: 2, name: 'A' },
    { string: 'D', fret: 2, name: 'E' },
    { string: 'A', fret: 0, name: 'A' },
    { string: 'A', fret: 3, name: 'C' },
    { string: 'E', fret: 0, name: 'E' },
  ],
};

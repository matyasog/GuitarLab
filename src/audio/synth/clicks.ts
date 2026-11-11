import type { ClickSound } from '../metronome/MetronomeEngine';
import { sampleRate } from './wav';

// The metronome sounds, made from simple maths instead of recordings (decision D3):
// - click:     a short high sine "tick" that dies away quickly
// - woodblock: two sine tones (a wooden "tok") with a fast decay
// - hihat:     filtered noise with a short decay
// The accented version (beat 1) is higher and louder.

const lengthMs = 60;

// Deterministic "random" numbers, so the hi-hat sounds the same every time (and in tests).
function noiseGenerator(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return (state / 4294967296) * 2 - 1;
  };
}

export function synthClick(sound: ClickSound, accent: boolean): Float32Array {
  const length = Math.round((sampleRate * lengthMs) / 1000);
  const samples = new Float32Array(length);
  const gain = accent ? 0.9 : 0.6;
  const noise = noiseGenerator(accent ? 7 : 3);
  let previousNoise = 0;

  for (let index = 0; index < length; index += 1) {
    const t = index / sampleRate; // seconds
    // A 1 ms fade-in avoids a pop at the very start.
    const attack = Math.min(1, t / 0.001);
    let value = 0;

    if (sound === 'click') {
      const frequency = accent ? 2600 : 2000;
      value = Math.sin(2 * Math.PI * frequency * t) * Math.exp(-t / 0.008);
    } else if (sound === 'woodblock') {
      const frequency = accent ? 1050 : 850;
      value =
        (0.7 * Math.sin(2 * Math.PI * frequency * t) + 0.3 * Math.sin(2 * Math.PI * frequency * 2.7 * t)) *
        Math.exp(-t / 0.012);
    } else {
      // Hi-hat: the difference of two noise samples removes the low frequencies (a simple high-pass).
      const white = noise();
      value = (white - previousNoise) * 0.5 * Math.exp(-t / (accent ? 0.025 : 0.015));
      previousNoise = white;
    }

    samples[index] = value * attack * gain;
  }

  return samples;
}

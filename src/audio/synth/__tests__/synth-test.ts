import { synthClick } from '../clicks';
import { encodeWav, sampleRate } from '../wav';

test('the WAV header describes 16-bit mono PCM', () => {
  const bytes = encodeWav(new Float32Array([0, 1, -1]));
  const view = new DataView(bytes.buffer);
  const text = (offset: number) => String.fromCharCode(...bytes.slice(offset, offset + 4));

  expect(bytes.length).toBe(44 + 3 * 2);
  expect([text(0), text(8), text(12), text(36)]).toEqual(['RIFF', 'WAVE', 'fmt ', 'data']);
  expect(view.getUint16(20, true)).toBe(1); // PCM
  expect(view.getUint16(22, true)).toBe(1); // mono
  expect(view.getUint32(24, true)).toBe(sampleRate);
  expect(view.getUint16(34, true)).toBe(16); // bits
  expect(view.getUint32(40, true)).toBe(6); // data bytes
  expect([view.getInt16(44, true), view.getInt16(46, true), view.getInt16(48, true)]).toEqual([0, 32767, -32767]);
});

test('every sound is short, stays within -1…1, fades out, and the accent is louder', () => {
  for (const sound of ['click', 'woodblock', 'hihat'] as const) {
    const normal = synthClick(sound, false);
    const accent = synthClick(sound, true);
    const peak = (samples: Float32Array) => Math.max(...Array.from(samples, Math.abs));

    expect(normal.length).toBe(Math.round(sampleRate * 0.06));
    expect(peak(accent)).toBeLessThanOrEqual(1);
    expect(peak(accent)).toBeGreaterThan(peak(normal));
    // The last 5 ms are nearly silent, so there is no click at the end of the file.
    expect(peak(normal.slice(-Math.round(sampleRate * 0.005)))).toBeLessThan(0.05);
  }
});

test('the hi-hat noise is the same every time', () => {
  expect(synthClick('hihat', false)).toEqual(synthClick('hihat', false));
});

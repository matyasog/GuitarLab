// Packs sound samples into a WAV file (16-bit PCM, mono), the simplest format every phone plays.
// Layout: a 44-byte header ("RIFF", "WAVE", "fmt " chunk, "data" chunk), then the samples.

export const sampleRate = 44100;

// Samples are -1 … 1; clip anything outside and scale to 16-bit integers.
export function floatToPcm16(samples: Float32Array): Int16Array {
  const pcm = new Int16Array(samples.length);
  for (let index = 0; index < samples.length; index += 1) {
    const value = Math.max(-1, Math.min(1, samples[index]));
    pcm[index] = Math.round(value * 32767);
  }
  return pcm;
}

export function encodeWavPcm16(pcm: Int16Array, rate = sampleRate): Uint8Array {
  const bytesPerSample = 2;
  const dataSize = pcm.length * bytesPerSample;
  const bytes = new Uint8Array(44 + dataSize);
  const view = new DataView(bytes.buffer);

  const writeText = (offset: number, text: string) => {
    for (let index = 0; index < text.length; index += 1) {
      view.setUint8(offset + index, text.charCodeAt(index));
    }
  };

  writeText(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true); // size of everything after this field
  writeText(8, 'WAVE');
  writeText(12, 'fmt ');
  view.setUint32(16, 16, true); // fmt chunk size
  view.setUint16(20, 1, true); // format 1 = PCM
  view.setUint16(22, 1, true); // channels: mono
  view.setUint32(24, rate, true);
  view.setUint32(28, rate * bytesPerSample, true); // bytes per second
  view.setUint16(32, bytesPerSample, true); // bytes per frame
  view.setUint16(34, 16, true); // bits per sample
  writeText(36, 'data');
  view.setUint32(40, dataSize, true);

  // Copy the samples as raw bytes (fast even for a 30 s track). WAV wants little-endian, which
  // is how every phone and PC processor stores an Int16Array anyway.
  bytes.set(new Uint8Array(pcm.buffer, pcm.byteOffset, pcm.byteLength), 44);
  return bytes;
}

export function encodeWav(samples: Float32Array, rate = sampleRate): Uint8Array {
  return encodeWavPcm16(floatToPcm16(samples), rate);
}

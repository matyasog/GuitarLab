# audio

Everything that makes or reads sound:
- `AudioStream` interface with a real (Android dev build) and a mock (Expo Go) implementation
- `dsp/`: pure TypeScript signal processing (pitch detection), unit-tested
- `metronome/`: the `MetronomeEngine` interface and its implementation

Native audio libraries are imported only inside the real implementation.

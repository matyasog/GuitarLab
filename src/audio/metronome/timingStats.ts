// Statistics for the timing measurement (step 4.1): how late each click was played compared
// to its planned time. "Late" is measured when JavaScript asked for the sound; the speaker's
// own delay is not visible to us (it is roughly constant, so it does not cause jitter).

export type TimingStats = {
  clicks: number;
  meanLateMs: number;
  maxLateMs: number;
  // Standard deviation of the lateness: how uneven the clicks are.
  jitterMs: number;
  // Mean lateness of the most recent clicks; if it grows over minutes, the clicks are drifting.
  recentMeanLateMs: number;
};

export function timingStats(lateMs: number[], recentCount = 50): TimingStats {
  if (lateMs.length === 0) {
    return { clicks: 0, meanLateMs: 0, maxLateMs: 0, jitterMs: 0, recentMeanLateMs: 0 };
  }
  const mean = average(lateMs);
  const variance = average(lateMs.map((value) => (value - mean) ** 2));
  return {
    clicks: lateMs.length,
    meanLateMs: mean,
    maxLateMs: Math.max(...lateMs),
    jitterMs: Math.sqrt(variance),
    recentMeanLateMs: average(lateMs.slice(-recentCount)),
  };
}

function average(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

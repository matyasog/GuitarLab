import type { MetronomeConfig } from '../MetronomeEngine';
import { MetronomeScheduler, clampBpm, clickPeriodMs, type PlannedClick } from '../scheduler';

const base: MetronomeConfig = { bpm: 120, timeSignature: '4/4', subdivision: 'quarter', sound: 'click' };

// Lets time pass in small steps (like the engine's ~10 ms timer) and collects the clicks.
function run(scheduler: MetronomeScheduler, from: number, until: number, step = 5): PlannedClick[] {
  const clicks: PlannedClick[] = [];
  for (let now = from; now <= until; now += step) {
    clicks.push(...scheduler.takeDue(now).due);
  }
  return clicks;
}

test('the click period follows tempo and subdivision', () => {
  expect(clickPeriodMs(base)).toBe(500);
  expect(clickPeriodMs({ ...base, subdivision: 'eighth' })).toBe(250);
  expect(clickPeriodMs({ ...base, bpm: 60, subdivision: 'sixteenth' })).toBe(250);
  expect(clampBpm(10)).toBe(40);
  expect(clampBpm(300)).toBe(240);
});

test('bars and beats count up, with beat 0 starting each bar', () => {
  const clicks = run(new MetronomeScheduler(base, 1000), 1000, 3000);
  expect(clicks.map((click) => [click.bar, click.beat])).toEqual([
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 0],
  ]);
  expect(clicks.map((click) => click.plannedTime)).toEqual([1000, 1500, 2000, 2500, 3000]);
});

test('no drift: with a timer waking at odd moments, click 600 is planned exactly at 5 minutes', () => {
  const clicks = run(new MetronomeScheduler(base, 0), 0, 300013, 13);
  expect(clicks).toHaveLength(601);
  expect(clicks[600].plannedTime).toBe(300000);
});

test('a click that is very late is skipped instead of played in a burst', () => {
  const scheduler = new MetronomeScheduler(base, 0);
  scheduler.takeDue(0);
  // The JS thread was blocked for 1.3 s: the clicks at 500 and 1000 ms are too late to play.
  const { due, skipped } = scheduler.takeDue(1300);
  expect(skipped).toBe(2);
  expect(due).toHaveLength(0);
  expect(scheduler.nextTime()).toBe(1500);
});

test('subdivisions add clicks between beats', () => {
  const clicks = run(new MetronomeScheduler({ ...base, subdivision: 'eighth' }, 0), 0, 750);
  expect(clicks.map((click) => [click.beat, click.sub, click.plannedTime])).toEqual([
    [0, 0, 0],
    [0, 1, 250],
    [1, 0, 500],
    [1, 1, 750],
  ]);
});

test('a tempo change starts on the next beat, not in the middle of one', () => {
  const scheduler = new MetronomeScheduler({ ...base, subdivision: 'eighth' }, 0);
  run(scheduler, 0, 250); // beat 0 and its "and"
  scheduler.update({ bpm: 60 });
  const clicks = run(scheduler, 255, 2000);
  // Beat 1 at 500 ms as planned; from there each beat is 1000 ms and each "and" 500 ms.
  expect(clicks.map((click) => click.plannedTime)).toEqual([500, 1000, 1500, 2000]);
});

test('changing to a shorter bar restarts at beat 1 when needed', () => {
  const scheduler = new MetronomeScheduler(base, 0);
  run(scheduler, 0, 1000); // beats 0, 1, 2
  scheduler.update({ timeSignature: '2/4' });
  const clicks = run(scheduler, 1005, 2500);
  expect(clicks.map((click) => [click.bar, click.beat])).toEqual([
    [1, 0],
    [1, 1],
    [2, 0],
  ]);
});

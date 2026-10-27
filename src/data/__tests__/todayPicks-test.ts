import { findLesson, lessons, sampleProgress } from '../lessons';
import { pickSession, pickUpNext, sessionKicker } from '../todayPicks';

test('with the sample scores, the session is the weakest lesson with exercises (as in the design)', () => {
  const pick = pickSession(lessons, sampleProgress);
  expect(pick).toEqual({ lesson: findLesson('em-pentatonic-box-1'), firstSession: false });
  expect(pickUpNext(lessons, sampleProgress, pick.lesson.id).map((lesson) => lesson.id)).toEqual([
    'eighth-notes',
    'riff-in-e',
  ]);
});

test('on the first day, the session is Quarter notes, then the easiest new lessons (as in the design)', () => {
  const pick = pickSession(lessons, {});
  expect(pick).toEqual({ lesson: findLesson('quarter-notes'), firstSession: true });
  expect(pickUpNext(lessons, {}, pick.lesson.id).map((lesson) => lesson.id)).toEqual([
    'chromatic-warm-up',
    'ode-to-joy',
  ]);
});

test('when every lesson with exercises is done, the session still has a lesson', () => {
  const allDone = { 'quarter-notes': { bestScore: 95 }, 'chromatic-warm-up': { bestScore: 95 }, 'em-pentatonic-box-1': { bestScore: 95 } };
  expect(pickSession(lessons, allDone).lesson.id).toBe('quarter-notes');
});

test('the kicker says tonight from 17:00', () => {
  const pick = pickSession(lessons, sampleProgress);
  expect(sessionKicker(pick, 16)).toBe("Today's session");
  expect(sessionKicker(pick, 17)).toBe("Tonight's session");
  expect(sessionKicker(pickSession(lessons, {}), 20)).toBe('Your first session');
});

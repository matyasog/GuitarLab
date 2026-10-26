import { getLayoutClass } from '../layout';

// Window sizes in points (width × height) and the size class the design expects.
test.each([
  [360, 640, 'compact'], // the design's compact frames
  [375, 667, 'compact'], // iPhone SE / 8
  [390, 844, 'regular'], // the design's regular frames (iPhone 14/15)
  [430, 932, 'regular'], // iPhone Pro Max
  [360, 800, 'regular'], // common tall Android phone
  [320, 720, 'compact'], // very narrow phone
  [768, 1024, 'wide'], // iPad
  [844, 390, 'regular'], // regular phone in landscape (Practice)
  [640, 360, 'compact'], // compact phone in landscape (Practice compact frames)
] as const)('%i × %i is %s', (width, height, expected) => {
  expect(getLayoutClass(width, height)).toBe(expected);
});

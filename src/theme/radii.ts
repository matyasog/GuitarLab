// Corner radius tokens from design/guitarlab.pen (`radius.*`).
// Instruments use real-object corners baked into their images, not these.

export const radii = {
  chip: 8,
  control: 12,
  card: 16,
  pill: 999,
} as const;

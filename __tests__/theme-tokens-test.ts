/// <reference types="node" />
// Node types only in tests: app code runs on the phone, where `fs` doesn't exist.
import { readFileSync } from 'fs';
import { join } from 'path';

import { darkColors, radii, space, typeSize } from '@/theme';

// The tokens in src/theme must match the variables in the design file exactly.
// If someone changes a colour in pen.dev, this test points at the token to update.
type PenVariable = { type: string; value: string | number };

const pen = JSON.parse(readFileSync(join(__dirname, '..', 'design', 'guitarlab.pen'), 'utf8')) as {
  variables: Record<string, PenVariable>;
};

function penVariables(prefix: string): [string, PenVariable][] {
  return Object.entries(pen.variables).filter(([name]) => name.startsWith(prefix));
}

// "color.surface-2" → "surface2", "color.amber-ink" → "amberInk"
function toCamelCase(name: string): string {
  return name.replace(/-(\w)/g, (_, letter: string) => letter.toUpperCase());
}

test('every color.* variable has a matching colour token', () => {
  for (const [name, variable] of penVariables('color.')) {
    const token = toCamelCase(name.slice('color.'.length)) as keyof typeof darkColors;
    expect({ name, value: darkColors[token] }).toEqual({ name, value: variable.value });
  }
});

test('there are no colour tokens that the design does not have', () => {
  const designNames = penVariables('color.').map(([name]) => toCamelCase(name.slice('color.'.length)));
  expect(Object.keys(darkColors).sort()).toEqual(designNames.sort());
});

test('space, radius and type tokens match the design', () => {
  for (const [name, variable] of penVariables('space.')) {
    expect(space[Number(name.slice('space.'.length)) as keyof typeof space]).toBe(variable.value);
  }
  for (const [name, variable] of penVariables('radius.')) {
    expect(radii[name.slice('radius.'.length) as keyof typeof radii]).toBe(variable.value);
  }
  for (const [name, variable] of penVariables('type.')) {
    expect(typeSize[Number(name.slice('type.'.length)) as keyof typeof typeSize]).toBe(variable.value);
  }
});

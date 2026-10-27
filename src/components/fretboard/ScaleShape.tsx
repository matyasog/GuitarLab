import { StyleSheet, View } from 'react-native';

import { colors, radii, space, type ColorName } from '@/theme';
import type { FretShape, GuitarString } from '@/types/lesson';

import { AppText } from '../AppText';

type ScaleShapeProps = {
  shape: FretShape;
  // Left-handed players see the board mirrored: nut on the right (Settings → Strumming hand).
  mirrored?: boolean;
  // full: Lesson detail (string names, note names, fret numbers, legend).
  // preview: Today's session card (smaller board only, plain dots, unused strings dimmed).
  variant?: 'full' | 'preview';
};

// Strings from top to bottom as the player looks down at the guitar, with their thickness.
const strings: { name: GuitarString; color: ColorName; thickness: number }[] = [
  { name: 'e', color: 'plain', thickness: 1 },
  { name: 'B', color: 'plain', thickness: 1 },
  { name: 'G', color: 'plain', thickness: 1.5 },
  { name: 'D', color: 'wound', thickness: 2 },
  { name: 'A', color: 'wound', thickness: 2 },
  { name: 'E', color: 'wound', thickness: 2.5 },
];

// Sizes from "Scale diagram" (Lesson detail) and "Fretboard preview" (Today's session card).
const sizes = {
  full: { rowHeight: 24, boardPadding: 6, openColumnWidth: 36, minFrets: 4, dot: 22, rootDot: 24 },
  preview: { rowHeight: 16.8, boardPadding: 5.6, openColumnWidth: 28, minFrets: 3, dot: 12, rootDot: 16 },
};
const nutWidth = 4;
const fretWireWidth = 2;
const labelColumnWidth = 16;
const inlayFrets = [3, 5, 7, 9];

// Lesson fretboard, from "Scale diagram (mirrors for left-handed)" in the Lesson detail design:
// string names, the wood board with the notes to play, fret numbers and a legend. The preview
// variant is the small board on Today's session card.
// Built from plain views: a column per fret, the strings drawn across, a dot per note.
export function ScaleShape({ shape, mirrored = false, variant = 'full' }: ScaleShapeProps) {
  const size = sizes[variant];
  const { rowHeight, boardPadding } = size;
  const boardHeight = boardPadding * 2 + rowHeight * strings.length; // 156 full, 112 preview
  const preview = variant === 'preview';
  const fretCount = Math.max(size.minFrets, ...shape.notes.map((note) => note.fret));
  const frets = Array.from({ length: fretCount }, (_, index) => index + 1);
  const row = mirrored ? styles.rowReverse : styles.row;
  const hasOpen = shape.notes.some((note) => note.fret === 0);

  // One cell per string in a fret column: the note's dot, or nothing.
  const renderCells = (fret: number) =>
    strings.map((string) => {
      const note = shape.notes.find((item) => item.string === string.name && item.fret === fret);
      return (
        <View key={string.name} style={[styles.cell, { height: rowHeight }]}>
          {note ? (
            <NoteDot
              name={note.name}
              root={note.name === shape.root}
              open={fret === 0}
              size={note.name === shape.root ? size.rootDot : size.dot}
              showName={!preview}
            />
          ) : null}
        </View>
      );
    });

  const board = (
    <View style={[row, styles.board, { height: boardHeight, paddingVertical: boardPadding }]}>
      {/* Strings first, so the frets and note dots sit on top of them. */}
      {strings.map((string, index) => {
        // The preview dims strings the lesson doesn't use ("open low E only").
        const unused = preview && !shape.notes.some((note) => note.string === string.name);
        return (
          <View
            key={string.name}
            style={[
              styles.string,
              {
                top: boardPadding + rowHeight * index + (rowHeight - string.thickness) / 2,
                height: string.thickness,
                backgroundColor: colors[string.color],
                opacity: unused ? 0.35 : 1,
              },
            ]}
          />
        );
      })}

      <View style={{ width: size.openColumnWidth }}>{renderCells(0)}</View>
      <View style={[styles.nut, { marginVertical: -boardPadding }]} />
      {frets.map((fret) => (
        <View
          key={fret}
          style={[
            styles.fret,
            { marginVertical: -boardPadding, paddingVertical: boardPadding },
            mirrored ? styles.wireLeft : styles.wireRight,
          ]}
        >
          {inlayFrets.includes(fret) ? <View style={[styles.inlay, { top: boardHeight / 2 - 4 }]} /> : null}
          {renderCells(fret)}
        </View>
      ))}
    </View>
  );

  if (preview) {
    return (
      // A row, so the board's flex: 1 fills the width (in a column it would collapse its height).
      <View style={styles.row} accessible accessibilityLabel={describe(shape)}>
        {board}
      </View>
    );
  }

  return (
    <View style={styles.diagram} accessible accessibilityLabel={describe(shape)}>
      <View style={[row, styles.boardRow]}>
        <View style={[styles.stringLabels, { paddingTop: boardPadding }]}>
          {strings.map((string) => (
            <View key={string.name} style={[styles.cell, { height: rowHeight }]}>
              <AppText variant="mono12" color="muted" maxFontSizeMultiplier={1.2}>
                {string.name}
              </AppText>
            </View>
          ))}
        </View>

        {board}
      </View>

      {/* Fret numbers line up under the columns: label column + gap, then open + nut. */}
      <View style={[row, mirrored ? styles.indentRight : styles.indentLeft]}>
        <View style={{ width: size.openColumnWidth + nutWidth, alignItems: 'center' }}>
          <FretNumber value={0} />
        </View>
        {frets.map((fret) => (
          <View key={fret} style={styles.fretNumber}>
            <FretNumber value={fret} />
          </View>
        ))}
      </View>

      <View style={[styles.legend, styles.indentLeft]}>
        {shape.root ? <LegendItem kind="root" label={`Root (${shape.root})`} /> : null}
        <LegendItem kind="note" label="Scale note" />
        {hasOpen ? <LegendItem kind="open" label="Open string" /> : null}
      </View>
    </View>
  );
}

// Roots are brass, other notes cream enamel; open strings are rings instead of filled dots.
type NoteDotProps = { name: string; root: boolean; open: boolean; size: number; showName: boolean };

function NoteDot({ name, root, open, size, showName }: NoteDotProps) {
  const ringColor = root ? colors.brass : colors.enamelCream;
  const look = open
    ? { backgroundColor: colors.woodDark, borderWidth: 2, borderColor: ringColor }
    : { backgroundColor: root ? colors.brass : colors.enamelCream };
  const textColor: ColorName = open ? (root ? 'brass' : 'enamelCream') : 'enamelInk';
  return (
    <View style={[styles.dot, look, { width: size, height: size }]}>
      {showName ? (
        <AppText variant="monoStrong12" color={textColor} maxFontSizeMultiplier={1}>
          {name}
        </AppText>
      ) : null}
    </View>
  );
}

function FretNumber({ value }: { value: number }) {
  return (
    <AppText variant="mono12" color="muted" maxFontSizeMultiplier={1.2}>
      {value}
    </AppText>
  );
}

function LegendItem({ kind, label }: { kind: 'root' | 'note' | 'open'; label: string }) {
  const swatch =
    kind === 'open'
      ? { borderWidth: 2, borderColor: colors.enamelCream }
      : { backgroundColor: kind === 'root' ? colors.brass : colors.enamelCream };
  return (
    <View style={styles.legendItem}>
      <View style={[styles.swatch, swatch]} />
      <AppText variant="caption12" color="muted">
        {label}
      </AppText>
    </View>
  );
}

// Spoken description for screen readers, string by string: "e string: open E, fret 3 G. …"
function describe(shape: FretShape): string {
  const lines = strings
    .map((string) => {
      const notes = shape.notes
        .filter((note) => note.string === string.name)
        .sort((a, b) => a.fret - b.fret)
        .map((note) => `${note.fret === 0 ? 'open' : `fret ${note.fret}`} ${note.name}`);
      return notes.length > 0 ? `${string.name} string: ${notes.join(', ')}` : null;
    })
    .filter(Boolean);
  const root = shape.root ? ` Root note ${shape.root}.` : '';
  return `Fretboard shape.${root} ${lines.join('. ')}.`;
}

const styles = StyleSheet.create({
  diagram: {
    gap: space[8],
  },
  row: {
    flexDirection: 'row',
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  boardRow: {
    gap: space[8],
  },
  stringLabels: {
    width: labelColumnWidth,
  },
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  board: {
    flex: 1,
    borderRadius: radii.chip,
    overflow: 'hidden',
    backgroundColor: colors.wood,
  },
  string: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  nut: {
    width: nutWidth,
    // A negative margin (set inline) stretches it over the board's padding, edge to edge.
    backgroundColor: colors.nut,
  },
  fret: {
    flex: 1,
    borderColor: colors.fret,
  },
  wireRight: {
    borderRightWidth: fretWireWidth,
  },
  wireLeft: {
    borderLeftWidth: fretWireWidth,
  },
  inlay: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    // Centred vertically (top set inline), between the G and D strings.
    alignSelf: 'center',
    backgroundColor: colors.woodLight,
  },
  dot: {
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indentLeft: {
    paddingLeft: labelColumnWidth + space[8],
  },
  indentRight: {
    paddingRight: labelColumnWidth + space[8],
  },
  fretNumber: {
    flex: 1,
    alignItems: 'center',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    columnGap: space[16],
    rowGap: space[4],
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[8],
  },
  swatch: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});

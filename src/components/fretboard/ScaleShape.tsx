import { StyleSheet, View } from 'react-native';

import { colors, radii, space, type ColorName } from '@/theme';
import type { FretShape, GuitarString } from '@/types/lesson';

import { AppText } from '../AppText';

type ScaleShapeProps = {
  shape: FretShape;
  // Left-handed players see the board mirrored: nut on the right (Settings → Strumming hand).
  mirrored?: boolean;
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

// Sizes from "Scale diagram" in the Lesson detail design.
const rowHeight = 24;
const boardPadding = 6; // above the first and below the last string row
const boardHeight = boardPadding * 2 + rowHeight * strings.length; // 156
const openColumnWidth = 36;
const nutWidth = 4;
const fretWireWidth = 2;
const labelColumnWidth = 16;
const inlayFrets = [3, 5, 7, 9];

// Lesson detail fretboard, from "Scale diagram (mirrors for left-handed)" in the design:
// string names, the wood board with the notes to play, fret numbers and a legend.
// Built from plain views: a column per fret, the strings drawn across, a dot per note.
export function ScaleShape({ shape, mirrored = false }: ScaleShapeProps) {
  const fretCount = Math.max(4, ...shape.notes.map((note) => note.fret));
  const frets = Array.from({ length: fretCount }, (_, index) => index + 1);
  const row = mirrored ? styles.rowReverse : styles.row;
  const hasOpen = shape.notes.some((note) => note.fret === 0);

  // One cell per string in a fret column: the note's dot, or nothing.
  const renderCells = (fret: number) =>
    strings.map((string) => {
      const note = shape.notes.find((item) => item.string === string.name && item.fret === fret);
      return (
        <View key={string.name} style={styles.cell}>
          {note ? <NoteDot name={note.name} root={note.name === shape.root} open={fret === 0} /> : null}
        </View>
      );
    });

  return (
    <View style={styles.diagram} accessible accessibilityLabel={describe(shape)}>
      <View style={[row, styles.boardRow]}>
        <View style={styles.stringLabels}>
          {strings.map((string) => (
            <View key={string.name} style={styles.cell}>
              <AppText variant="mono12" color="muted" maxFontSizeMultiplier={1.2}>
                {string.name}
              </AppText>
            </View>
          ))}
        </View>

        <View style={[row, styles.board]}>
          {/* Strings first, so the frets and note dots sit on top of them. */}
          {strings.map((string, index) => (
            <View
              key={string.name}
              style={[
                styles.string,
                {
                  top: boardPadding + rowHeight * index + (rowHeight - string.thickness) / 2,
                  height: string.thickness,
                  backgroundColor: colors[string.color],
                },
              ]}
            />
          ))}

          <View style={styles.openColumn}>{renderCells(0)}</View>
          <View style={styles.nut} />
          {frets.map((fret) => (
            <View key={fret} style={[styles.fret, mirrored ? styles.wireLeft : styles.wireRight]}>
              {inlayFrets.includes(fret) ? <View style={styles.inlay} /> : null}
              {renderCells(fret)}
            </View>
          ))}
        </View>
      </View>

      {/* Fret numbers line up under the columns: label column + gap, then open + nut. */}
      <View style={[row, mirrored ? styles.indentRight : styles.indentLeft]}>
        <View style={styles.fretZeroNumber}>
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
function NoteDot({ name, root, open }: { name: string; root: boolean; open: boolean }) {
  const ringColor = root ? colors.brass : colors.enamelCream;
  const look = open
    ? { backgroundColor: colors.woodDark, borderWidth: 2, borderColor: ringColor }
    : { backgroundColor: root ? colors.brass : colors.enamelCream };
  const textColor: ColorName = open ? (root ? 'brass' : 'enamelCream') : 'enamelInk';
  const size = root ? 24 : 22;

  return (
    <View style={[styles.dot, look, { width: size, height: size }]}>
      <AppText variant="monoStrong12" color={textColor} maxFontSizeMultiplier={1}>
        {name}
      </AppText>
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
    paddingTop: boardPadding,
  },
  cell: {
    height: rowHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  board: {
    flex: 1,
    height: boardHeight,
    paddingVertical: boardPadding,
    borderRadius: radii.chip,
    overflow: 'hidden',
    backgroundColor: colors.wood,
  },
  string: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  openColumn: {
    width: openColumnWidth,
  },
  nut: {
    width: nutWidth,
    // Stretches over the board's padding, so it runs from edge to edge.
    marginVertical: -boardPadding,
    backgroundColor: colors.nut,
  },
  fret: {
    flex: 1,
    marginVertical: -boardPadding,
    paddingVertical: boardPadding,
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
    // Centre of the board, between the G and D strings.
    top: boardHeight / 2 - 4,
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
  fretZeroNumber: {
    width: openColumnWidth + nutWidth,
    alignItems: 'center',
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

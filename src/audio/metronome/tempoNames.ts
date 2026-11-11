// Italian tempo names shown above the BPM ("Adagio" at 72, "Presto" at 184 in the design).
// The ranges are the usual textbook ones, chosen 2026-11-11; each entry starts at `from` BPM.
const tempoNames: { from: number; name: string }[] = [
  { from: 200, name: 'Prestissimo' },
  { from: 168, name: 'Presto' },
  { from: 120, name: 'Allegro' },
  { from: 108, name: 'Moderato' },
  { from: 76, name: 'Andante' },
  { from: 66, name: 'Adagio' },
  { from: 60, name: 'Larghetto' },
  { from: 0, name: 'Largo' },
];

export function tempoName(bpm: number): string {
  return tempoNames.find((entry) => bpm >= entry.from)!.name;
}

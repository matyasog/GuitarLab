/**
 * @schema 2.11
 * @input beat: number(min=-4, max=23) = 0
 * @input results: string = ""
 * @input fontMono: string = "DM Mono"
 * @input tokenFontSize: number = 16
 * @input labelFontSize: number = 14
 * @input tokenRadius: number = 8
 * @input amber: color
 * @input amberInk: color
 * @input amberWash: color
 * @input cream: color
 * @input ink: color
 * @input green: color
 * @input red: color
 * @input redSoft: color
 * @input sunken: color
 * @input plain: color
 * @input wound: color
 */

// GuitarLab – Practice note highway, one moment in time.
// Output layers (bottom to top, above the hand-built static-highway):
//   feedback-overlay: active-lane highlight + hit-line flash (opacity only in code)
//   moving-notes:     ONE strip, translateX = HIT_X - beat * SPACING (linear, audio clock)

const HIT_X = 85;          // hit line centre, from the highway's left edge
const SPACING = 112;       // px per note (one eighth note at 72 BPM)
const TOKEN_W = 46;
const TOKEN_H = 34;
const RING_GAP = 2;        // gap between the next token and its ring
const RING_W = 2;          // crisp outer ring, no blur or glow
const FLASH_BEATS = 0.6;   // 250 ms at 72 BPM eighths (1 beat = 417 ms)
const LABEL_X = 12;
const LABEL_W = 16;
const STRING_X = 36;       // strings start right of the label column
const HIT_BAR_W = 4;

const LANES = ["e", "B", "G", "D", "A", "E"]; // high e on top
const GAUGE = { e: 1, B: 1, G: 1.5, D: 2, A: 2.5, E: 3 };
const WOUND = { D: true, A: true, E: true };

const SEQUENCE = [
  "E:0", "E:3", "A:0", "A:2", "D:0", "D:2", "G:0", "G:2", "B:0", "B:3", "e:0", "e:3",
  "e:0", "B:3", "B:0", "G:2", "G:0", "D:2", "D:0", "A:2", "A:0", "E:3", "E:0",
].map((s, i) => {
  const [string, fret] = s.split(":");
  return { beat: i, string, fret };
});

const inp = pencil.input;
const W = pencil.width;
const H = pencil.height;
const beat = Math.max(-4, Math.min(23, Number(inp.beat) || 0));
const results = String(inp.results || "").toUpperCase().replace(/[^PGMBU]/g, "").slice(0, SEQUENCE.length);
const laneH = H / LANES.length;
const laneTop = (s) => LANES.indexOf(s) * laneH;
const nextIndex = results.length < SEQUENCE.length ? results.length : -1;

const mono = (content, fill, size) => ({
  type: "text", name: "Fret", content, fill,
  fontFamily: inp.fontMono, fontSize: size, fontWeight: "500",
});

// ---------- feedback-overlay ----------
const overlay = [];
if (nextIndex >= 0) {
  const s = SEQUENCE[nextIndex].string;
  const y = laneTop(s);
  const g = GAUGE[s];
  overlay.push(
    { type: "rectangle", name: "Active lane wash · " + s, x: 0, y, width: W, height: laneH, fill: inp.amberWash },
    { type: "rectangle", name: "Active string · " + s, x: STRING_X, y: y + (laneH - g) / 2, width: W - STRING_X, height: g, fill: WOUND[s] ? inp.wound : inp.plain },
    {
      type: "frame", name: "Active label · " + s, x: LABEL_X, y, width: LABEL_W, height: laneH,
      layout: "horizontal", justifyContent: "center", alignItems: "center",
      children: [{ ...mono(s, inp.amber, inp.labelFontSize), name: "Label" }],
    },
  );
}
const last = results.length - 1;
const dt = beat - last;
if (last >= 0 && dt >= 0 && dt < FLASH_BEATS) {
  const r = results[last];
  const c = r === "P" ? inp.green : r === "G" ? inp.cream : inp.red;
  overlay.push({
    type: "rectangle", name: "Hit-line flash · " + r, x: HIT_X - HIT_BAR_W / 2, y: 0,
    width: HIT_BAR_W, height: H, fill: c, opacity: Math.round((1 - dt / FLASH_BEATS) * 100) / 100,
  });
}

// ---------- moving-notes ----------
const stripX = HIT_X - beat * SPACING;
const tokens = [];
SEQUENCE.forEach((n, i) => {
  const cx = n.beat * SPACING;              // centre inside the strip
  const screenX = stripX + cx;              // = HIT_X + (n.beat - beat) * SPACING
  if (screenX < -TOKEN_W || screenX > W + TOKEN_W) return; // recycled
  const r = i < results.length ? results[i] : null;
  const isNext = i === nextIndex;
  const x = cx - TOKEN_W / 2;
  const y = laneTop(n.string) + (laneH - TOKEN_H) / 2;
  const state = r === "P" ? "perfect" : r === "G" ? "good" : r === "M" ? "missed" : r === "B" ? "buzz" : r === "U" ? "muted" : isNext ? "next" : "upcoming";
  const name = "Note " + (i + 1) + " · " + n.string + ":" + n.fret + " · " + state;

  let fill, stroke, numColor, mark = null;
  if (state === "perfect") { fill = inp.green; numColor = inp.ink; mark = { icon: "check", color: inp.ink }; }
  else if (state === "good") { fill = inp.cream; numColor = inp.ink; }
  else if (r) { fill = inp.redSoft; stroke = inp.red; numColor = inp.red; mark = { icon: "x", color: inp.red }; }
  else if (isNext) { fill = inp.amber; numColor = inp.amberInk; }
  else { fill = inp.sunken; stroke = inp.cream; numColor = inp.cream; }

  if (isNext) {
    const o = RING_GAP + RING_W;
    tokens.push({
      type: "rectangle", name: "Next ring · note " + (i + 1), x: x - o, y: y - o,
      width: TOKEN_W + 2 * o, height: TOKEN_H + 2 * o, cornerRadius: inp.tokenRadius + o,
      stroke: inp.amber, strokeWidth: RING_W, strokeAlignment: "inner",
    });
  }
  const children = [mono(n.fret, numColor, inp.tokenFontSize)];
  if (mark) children.push({ type: "icon", name: mark.icon === "check" ? "Check" : "Cross", library: "lucide", icon: mark.icon, width: 12, height: 12, fill: mark.color });
  tokens.push({
    type: "frame", name, x, y, width: TOKEN_W, height: TOKEN_H, cornerRadius: inp.tokenRadius,
    fill, ...(stroke ? { stroke, strokeWidth: 1.5, strokeAlignment: "inner" } : {}),
    layout: "horizontal", gap: 2, justifyContent: "center", alignItems: "center", children,
  });
});

return [
  { type: "frame", name: "feedback-overlay", x: 0, y: 0, width: W, height: H, layout: "none", children: overlay },
  {
    type: "frame", name: "moving-notes · strip translateX = hitLineX − beat × 112",
    x: stripX - TOKEN_W / 2, y: 0, width: (SEQUENCE.length - 1) * SPACING + TOKEN_W, height: H, layout: "none",
    children: tokens.map((t) => ({ ...t, x: t.x + TOKEN_W / 2 })), // strip origin = note 1 left edge
  },
];

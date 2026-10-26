// Throwaway analysis script: prints the structure of the .pen design file
// without loading it into an editor.
// Usage:
//   node scripts/design/inspect-pen.js summary          top-level keys, variables, fonts, images
//   node scripts/design/inspect-pen.js frames           top-level frames (name, id, x, y, size)
//   node scripts/design/inspect-pen.js tree <id> [depth] layer tree below one node
//   node scripts/design/inspect-pen.js props <id>        layer tree with style properties
//   node scripts/design/inspect-pen.js texts <id>        all text content below one node
//   node scripts/design/inspect-pen.js refs                which components each screen uses
//   node scripts/design/inspect-pen.js find <text>      nodes whose name contains <text>
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', '..', 'design', 'guitarlab.pen');
const doc = JSON.parse(fs.readFileSync(file, 'utf8'));
const [cmd = 'summary', arg, arg2] = process.argv.slice(2);

function walk(node, fn, depth = 0, parent = null) {
  fn(node, depth, parent);
  for (const child of node.children || []) walk(child, fn, depth + 1, node);
}

function size(n) {
  return `${n.width ?? '?'}x${n.height ?? '?'}`;
}

if (cmd === 'summary') {
  console.log('top-level keys:', Object.keys(doc));
  console.log('children:', doc.children.length);
  if (doc.variables) {
    console.log('\nvariables:');
    for (const [name, v] of Object.entries(doc.variables)) {
      console.log(' ', name, JSON.stringify(v));
    }
  }
  for (const key of Object.keys(doc)) {
    if (!['children', 'variables', 'version'].includes(key)) {
      console.log(`\n${key}:`, JSON.stringify(doc[key]).slice(0, 2000));
    }
  }
  const fonts = new Map();
  const images = new Map();
  const types = new Map();
  for (const top of doc.children) {
    walk(top, (n) => {
      types.set(n.type, (types.get(n.type) || 0) + 1);
      if (n.fontFamily) fonts.set(n.fontFamily, (fonts.get(n.fontFamily) || 0) + 1);
      const fills = [].concat(n.fill || []);
      for (const f of fills) {
        if (f && typeof f === 'object' && (f.type === 'image' || f.url)) {
          const key = f.url || JSON.stringify(f).slice(0, 80);
          images.set(key, (images.get(key) || 0) + 1);
        }
      }
    });
  }
  console.log('\nnode types:', Object.fromEntries(types));
  console.log('\nfonts:', Object.fromEntries(fonts));
  console.log('\nimage fills:');
  for (const [k, c] of images) console.log(' ', c, 'x', k.slice(0, 120));
}

if (cmd === 'frames') {
  for (const n of doc.children) {
    console.log(`${n.id}\t${n.type}\t${n.x},${n.y}\t${size(n)}\t${n.name}`);
  }
}

if (cmd === 'tree') {
  const maxDepth = Number(arg2 ?? 3);
  let target = null;
  for (const top of doc.children) walk(top, (n) => { if (n.id === arg) target = n; });
  if (!target) throw new Error(`id ${arg} not found`);
  walk(target, (n, d) => {
    if (d > maxDepth) return;
    const extra = [];
    if (n.content) extra.push(JSON.stringify(String(n.content).slice(0, 60)));
    if (n.ref) extra.push(`ref=${n.ref}`);
    if (n.rotation) extra.push(`rot=${n.rotation}`);
    if (n.x !== undefined) extra.push(`@${n.x},${n.y}`);
    console.log(`${'  '.repeat(d)}${n.type} ${n.id} "${n.name ?? ''}" ${size(n)} ${extra.join(' ')}`);
  });
}

if (cmd === 'props') {
  // Layer tree below one node with its style properties (for building components).
  const skip = new Set(['children', 'id', 'name', 'type', 'x', 'y', 'descendants']);
  let target = null;
  for (const top of doc.children) walk(top, (n) => { if (n.id === arg) target = n; });
  if (!target) throw new Error(`id ${arg} not found`);
  walk(target, (n, d) => {
    const props = Object.entries(n)
      .filter(([k]) => !skip.has(k))
      .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
      .join(' ');
    console.log(`${'  '.repeat(d)}${n.type} "${n.name ?? ''}" ${props}`);
    if (n.descendants) console.log(`${'  '.repeat(d + 1)}overrides ${JSON.stringify(n.descendants)}`);
  });
}

if (cmd === 'texts') {
  // All text content below one node, in order (copy, spec notes).
  for (const top of doc.children) {
    walk(top, (n) => {
      if (n.id !== arg) return;
      walk(n, (t) => {
        if (t.type === 'text' && t.content) console.log(`[${t.name}] ${t.content}`);
        // Component instances keep their copy as overrides in `descendants`.
        // Overrides can replace whole subtrees, so search them recursively.
        if (t.type === 'ref' && t.descendants) {
          const seen = (o) => {
            if (!o || typeof o !== 'object') return;
            if (typeof o.content === 'string') console.log(`[${t.name} >] ${o.content}`);
            for (const v of Object.values(o)) seen(v);
          };
          seen(t.descendants);
        }
      });
    });
  }
}

if (cmd === 'refs') {
  // For every screen frame: which reusable components it uses (instances).
  const names = new Map();
  for (const top of doc.children) walk(top, (n) => { if (n.reusable) names.set(n.id, n.name); });
  for (const top of doc.children) {
    const used = new Map();
    walk(top, (n) => {
      if (n.type === 'ref') {
        const name = names.get(n.ref) || n.ref;
        used.set(name, (used.get(name) || 0) + 1);
      }
    });
    if (used.size) {
      const list = [...used].map(([k, c]) => (c > 1 ? `${k} ×${c}` : k));
      console.log(`${top.name}\n    ${list.join(' | ')}`);
    }
  }
}

if (cmd === 'find') {
  for (const top of doc.children) {
    walk(top, (n, d) => {
      if ((n.name || '').toLowerCase().includes(String(arg).toLowerCase())) {
        console.log(`${n.id}\t${n.type}\t${size(n)}\tin "${top.name}"\t${n.name}`);
      }
    });
  }
}

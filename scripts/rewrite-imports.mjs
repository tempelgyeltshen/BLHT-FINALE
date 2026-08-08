// Migration helper: moves files per a JSON map and rewrites relative imports.
// Usage: node scripts/rewrite-imports.mjs <map.json>
// map.json: { "moves": { "old/path": "new/path" }, "deletes": ["old/path"] }
// Paths are relative to the project root. When the destination already exists,
// the source is deleted (the mapping still applies for import rewriting).
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const mapPath = process.argv[2];
if (!mapPath) {
  console.error('Usage: node scripts/rewrite-imports.mjs <map.json>');
  process.exit(1);
}
const { moves = {}, deletes = [] } = JSON.parse(fs.readFileSync(mapPath, 'utf8'));

const norm = (p) => p.replace(/\\/g, '/');
const stripExt = (p) => p.replace(/\.(ts|tsx|js|mjs|cjs)$/, '');

// Absolute no-extension keys for import resolution
const targetMap = new Map();
for (const [from, to] of Object.entries(moves)) {
  targetMap.set(stripExt(norm(path.resolve(root, from))), stripExt(norm(path.resolve(root, to))));
}
for (const [from, to] of Object.entries(moves)) {
  // also allow lookup with extension present
  targetMap.set(norm(path.resolve(root, from)), stripExt(norm(path.resolve(root, to))));
}
for (const d of deletes) {
  targetMap.set(stripExt(norm(path.resolve(root, d))), null);
}

// Reverse map: new location -> old location, so imports inside moved files can
// be resolved against where the file originally lived.
const oldLocationOf = new Map();
for (const [from, to] of Object.entries(moves)) {
  oldLocationOf.set(stripExt(norm(path.resolve(root, to))), stripExt(norm(path.resolve(root, from))));
}

// 1. Move / delete files
for (const [from, to] of Object.entries(moves)) {
  const src = path.resolve(root, from);
  const dst = path.resolve(root, to);
  if (!fs.existsSync(src)) {
    console.log(`SKIP (missing source): ${from}`);
    continue;
  }
  if (src === dst) continue;
  if (fs.existsSync(dst)) {
    // destination already holds the canonical version -> delete source
    fs.rmSync(src, { force: true });
    console.log(`DELETED (dest exists): ${from} -> ${to}`);
  } else {
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.renameSync(src, dst);
    console.log(`MOVED: ${from} -> ${to}`);
  }
}
for (const d of deletes) {
  const abs = path.resolve(root, d);
  if (fs.existsSync(abs)) {
    fs.rmSync(abs, { recursive: true, force: true });
    console.log(`DELETED: ${d}`);
  }
}

// 2. Rewrite relative imports in every TS/TSX file under the project src dirs
// For moved files: spec resolves against the ORIGINAL dir, and the rewritten path
// is computed relative to the NEW dir. For non-moved files both dirs are the same.
const rewriteSpec = (spec, fromDir, toDir) => {
  const abs = stripExt(norm(path.resolve(fromDir, spec)));
  const hit = targetMap.get(abs);
  let targetAbs;
  if (hit === undefined) {
    // module did not move -> recompute relative path from the new location
    targetAbs = abs;
  } else if (hit === null) {
    return ''; // module was deleted (caller should fix manually)
  } else {
    targetAbs = hit;
  }
  const rel = norm(path.relative(toDir, targetAbs));
  const bare = rel.startsWith('.') ? rel : `./${rel}`;
  return spec.endsWith('.js') ? `${bare}.js` : bare;
};

let changedFiles = 0;
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === 'coverage') continue;
      walk(full);
    } else if (/\.(ts|tsx|mts)$/.test(entry.name)) {
      const file = fs.readFileSync(full, 'utf8');
      let out = file;
      let hitCount = 0;
      // For moved files, resolve relative imports against the ORIGINAL location
      const origAbs = oldLocationOf.get(stripExt(norm(full)));
      const resolveDir = origAbs ? path.dirname(origAbs) : path.dirname(full);
      const newDir = path.dirname(full);

      // from '...' imports (covers import/export-from)
      out = out.replace(/(\bfrom\s+)(['"])(\.[^'"]+)(['"])/g, (m, pre, q, spec, q2) => {
        const r = rewriteSpec(spec, resolveDir, newDir);
        if (r === null) return m;
        if (r === '') {
          console.log(`  WARN (deleted target, manual fix): ${norm(path.relative(root, full))} imports '${spec}'`);
          return m;
        }
        hitCount++;
        return `${pre}${q}${r}${q2}`;
      });

      // side-effect imports: import './x'
      out = out.replace(/(^|\n)(\s*import\s+)(['"])(\.[^'"]+)(['"])(\s*;?)/g, (m, nl, pre, q, spec, q2, semi) => {
        const r = rewriteSpec(spec, resolveDir, newDir);
        if (r === null) return m;
        if (r === '') {
          console.log(`  WARN (deleted target, manual fix): ${norm(path.relative(root, full))} imports '${spec}'`);
          return m;
        }
        hitCount++;
        return `${nl}${pre}${q}${r}${q2}${semi}`;
      });

      // dynamic imports: import('./x')
      out = out.replace(/(\bimport\s*\(\s*)(['"])(\.[^'"]+)(['"])(\s*\))/g, (m, pre, q, spec, q2, close) => {
        const r = rewriteSpec(spec, resolveDir, newDir);
        if (r === null) return m;
        if (r === '') {
          console.log(`  WARN (deleted target, manual fix): ${norm(path.relative(root, full))} imports '${spec}'`);
          return m;
        }
        hitCount++;
        return `${pre}${q}${r}${q2}${close}`;
      });

      // vi.mock('...') path strings
      out = out.replace(/(vi\.mock\s*\(\s*)(['"])(\.[^'"]+)(['"])/g, (m, pre, q, spec, q2) => {
        const r = rewriteSpec(spec, resolveDir, newDir);
        if (r === null) return m;
        if (r === '') {
          console.log(`  WARN (deleted mock target, manual fix): ${norm(path.relative(root, full))} mocks '${spec}'`);
          return m;
        }
        hitCount++;
        return `${pre}${q}${r}${q2}`;
      });

      if (hitCount > 0 && out !== file) {
        fs.writeFileSync(full, out);
        changedFiles++;
        console.log(`REWROTE (${hitCount}): ${norm(path.relative(root, full))}`);
      }
    }
  }
};

for (const dir of ['backend/src', 'frontend/src']) {
  if (fs.existsSync(path.join(root, dir))) walk(path.join(root, dir));
}
console.log(`\nDone. ${changedFiles} files rewritten.`);

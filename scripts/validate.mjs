// Validates the extension source: manifest shape, referenced files, version sync, changelog,
// and that the popup never reaches the network (no remote scripts, styles, fonts or images).
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { ROOT, SRC, SEMVER, manifest, pkg, changelogSection } from './lib.mjs';

const errors = [];
const fail = (msg) => errors.push(msg);

const m = manifest();
const p = pkg();

if (m.manifest_version !== 3) fail('manifest_version must be 3');
for (const key of ['name', 'version', 'description', 'icons', 'action']) {
  if (!m[key]) fail(`manifest is missing "${key}"`);
}
if (!SEMVER.test(m.version)) fail(`manifest version "${m.version}" is not x.y.z`);
if (m.version !== p.version) {
  fail(`version mismatch: manifest ${m.version} vs package.json ${p.version}`);
}
if (m.description && m.description.length > 132) {
  fail(`manifest description is ${m.description.length} chars (Chrome Web Store max is 132)`);
}
if (!changelogSection(m.version)) fail(`CHANGELOG.md has no "## [${m.version}]" section`);
if (!/default-src 'self'/.test(m.content_security_policy?.extension_pages || '')) {
  fail(`manifest CSP must keep "default-src 'self'" so the popup makes no network requests`);
}

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const full = join(dir, f);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
const rel = (file) => relative(ROOT, file);

// Every file referenced by the manifest, the popup HTML and its stylesheets must exist.
const referenced = new Set();
Object.values(m.icons ?? {}).forEach((f) => referenced.add(f));
Object.values(m.action?.default_icon ?? {}).forEach((f) => referenced.add(f));
if (m.action?.default_popup) referenced.add(m.action.default_popup);
for (const file of walk(SRC).filter((f) => /\.(html|css)$/.test(f))) {
  const code = readFileSync(file, 'utf8');
  const refs = [
    ...code.matchAll(/<(?:script|img|link)\b[^>]*\b(?:src|href)=["']([^"']+)["']/gi),
    ...code.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/gi),
  ].map((r) => r[1]);
  for (const ref of refs) {
    if (/^(https?:)?\/\//i.test(ref)) fail(`${rel(file)} loads a remote resource: ${ref}`);
    else if (!ref.startsWith('data:')) referenced.add(relative(SRC, join(file, '..', ref)));
  }
  if (/@import\s/i.test(code)) fail(`${rel(file)} uses @import`);
}
for (const file of referenced) {
  if (!existsSync(join(SRC, file))) fail(`missing referenced file: src/${file}`);
}

// No remotely hosted code, network calls or dynamic evaluation.
for (const file of walk(SRC).filter((f) => /\.js$/.test(f))) {
  const code = readFileSync(file, 'utf8');
  if (/\beval\s*\(|new Function\s*\(/.test(code)) fail(`${rel(file)} uses eval/new Function`);
  if (/\bfetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon/.test(code)) {
    fail(`${rel(file)} makes network requests`);
  }
}

if (errors.length) {
  console.error('✖ Validation failed:\n' + errors.map((e) => `  • ${e}`).join('\n'));
  process.exit(1);
}
console.log(`✔ LiquidDo v${m.version} is valid (${referenced.size} referenced files, no network).`);

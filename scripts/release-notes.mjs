// Prints GitHub Release notes for a version (defaults to the manifest version).
import { changelogSection, manifest } from './lib.mjs';

const version = (process.argv[2] || manifest().version).replace(/^v/, '');
const section = changelogSection(version);
if (!section) {
  console.error(`✖ CHANGELOG.md has no section for ${version}`);
  process.exit(1);
}
process.stdout.write(`${section}

---

### Install

Install LiquidDo from the **[Chrome Web Store](https://chromewebstore.google.com/detail/alacajgllgfcbcbggeokhdapaopjgldc)**, or run it from source (clone the repo, then \`chrome://extensions\` → **Developer mode** → **Load unpacked** → the \`src/\` folder).
See the [README](https://github.com/theysap/LiquidDo#install) and the [user manual](https://github.com/theysap/LiquidDo/blob/master/USERMANUAL.md).

Full history: [CHANGELOG.md](https://github.com/theysap/LiquidDo/blob/master/CHANGELOG.md)
`);

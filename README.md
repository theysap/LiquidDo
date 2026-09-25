<div align="center">

<img src="icons/icon128.png" width="112" alt="LiquidDo icon" />

# LiquidDo

**A beautiful Liquid Glass to-do list, right in your toolbar.**
A Chrome extension to add, complete and manage tasks in one click — private, offline-first and nothing to sign up for.

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/alacajgllgfcbcbggeokhdapaopjgldc?logo=googlechrome&logoColor=white&label=Chrome%20Web%20Store)](https://chromewebstore.google.com/detail/alacajgllgfcbcbggeokhdapaopjgldc)
[![Manifest V3](https://img.shields.io/badge/Chrome-Manifest%20V3-4285F4?logo=googlechrome&logoColor=white)](https://developer.chrome.com/docs/extensions/mv3/)
[![License: MIT](https://img.shields.io/badge/License-MIT-lightgrey.svg)](LICENSE)

📖 **[Read the user manual](USERMANUAL.md)** — every part of the popup explained, known issues and how to report a problem.

</div>

---

## Contents

- [User manual](USERMANUAL.md)
- [Highlights](#highlights)
- [Install](#install)
- [Using LiquidDo](#using-liquiddo)
- [How it works](#how-it-works)
- [Development](#development)
- [Releasing](#releasing)
- [Privacy](#privacy)
- [Contributing](#contributing)
- [License & trademarks](#license--trademarks)

## Highlights

|                            |                                                                                                    |
| -------------------------- | -------------------------------------------------------------------------------------------------- |
| ➕ **Quick add**           | Click the icon and start typing — the task box is focused. <kbd>Enter</kbd> adds the task.        |
| ✅ **Active & Completed**  | Tick tasks off to move them to Completed; tick again to bring them back. Clear all completed at once. |
| 🕒 **Timestamps**          | Every task shows when it was added or completed — "just now", "3h ago", "Completed 2d ago".        |
| 🪟 **Liquid Glass design** | Frosted glass surfaces, soft gradients and the Lora typeface.                                     |
| 🔒 **Private by design**   | No analytics, no servers, no accounts. Tasks stay on your computer. Only the `storage` permission. |

## Install

### From the Chrome Web Store

Install **[LiquidDo](https://chromewebstore.google.com/detail/alacajgllgfcbcbggeokhdapaopjgldc)** from the Chrome Web Store, then pin it from the puzzle-piece menu.

### From source

```bash
git clone https://github.com/theysap/LiquidDo.git
```

Open `chrome://extensions`, turn on **Developer mode**, click **Load unpacked** and select the repository folder. After editing, press ↻ on the extension card and reopen the popup.

## Using LiquidDo

| Action                 | How                                                                  |
| ---------------------- | -------------------------------------------------------------------- |
| Add a task             | Type in the box, press <kbd>Enter</kbd> or click ＋                  |
| Complete / un-complete | Click the circle next to a task                                      |
| Delete a task          | Click ✕ on the task                                                  |
| Clear completed        | **Completed** tab → **Clear all completed**                          |
| Clear the task box     | <kbd>Esc</kbd>                                                       |

Full details: [user manual](USERMANUAL.md).

## How it works

LiquidDo is a single Manifest V3 action popup — no background worker, no content scripts, no build step.

```
manifest.json   MV3 manifest (action popup, storage permission, icons)
popup.html      Popup markup: header, tabs, task input, list, empty state, footer
popup.css       Liquid Glass styles
popup.js        State, rendering and actions
icons/          16 / 48 / 128 px icons
```

Tasks are kept as an array under the `liquiddo_tasks` key in `chrome.storage.local`:

```js
{ id, text, done, createdAt, completedAt }
```

`popup.js` loads the array when the popup opens, re-renders the list on every change and writes the whole array back. Opened outside the extension (e.g. `popup.html` straight in a browser tab) it falls back to `localStorage`, which is handy for styling work.

## Development

1. **Load unpacked** the repository folder (see [From source](#from-source)).
2. Edit `popup.*`, press ↻ on the extension card, and reopen the popup. Right-click the popup → **Inspect** for DevTools.
3. Formatting follows `.editorconfig` (2-space indent, LF, final newline).

### Conventions

- **Every commit is versioned**: the subject is exactly `vX.Y.Z`; any details go in the commit body.
- Each version bumps `"version"` in `manifest.json` and adds a [CHANGELOG.md](CHANGELOG.md) entry.
- Update [USERMANUAL.md](USERMANUAL.md) and [PRIVACY.md](PRIVACY.md) whenever behaviour or data handling changes.

## Releasing

1. Bump `manifest.json`, finish the `CHANGELOG.md` entry and commit as `vX.Y.Z`.
2. Tag it: `git tag vX.Y.Z && git push --follow-tags`.
3. Create a GitHub Release from the tag with the changelog entry as notes.
4. Zip the extension files for the Chrome Web Store (zips are git-ignored):
   ```bash
   mkdir -p chrome && zip -r chrome/liquiddo-vX.Y.Z.zip manifest.json popup.html popup.css popup.js icons -x '*.DS_Store'
   ```
5. Upload the zip in the [Chrome Web Store developer dashboard](https://chrome.google.com/webstore/devconsole).

## Privacy

LiquidDo collects nothing: no analytics, no telemetry, no accounts. Tasks live only in `chrome.storage.local` on your computer. The popup loads the Lora font from Google Fonts; no task data is ever sent. Full policy: [PRIVACY.md](PRIVACY.md).

## Contributing

Found a bug? See [How to report an issue](USERMANUAL.md#how-to-report-an-issue). Issues and pull requests are welcome — please use the templates, bump the version and add a changelog entry.

## License & trademarks

[MIT](LICENSE) © 2026 Aashish Paruvada.

LiquidDo is an independent project and is not affiliated with, endorsed by or sponsored by Apple or Google. "Liquid Glass" is referenced only to describe the design inspiration.

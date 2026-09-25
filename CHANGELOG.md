# Changelog

All notable changes to LiquidDo are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses [Semantic Versioning](https://semver.org/). Every commit is versioned (subject `vX.Y.Z`, details in the body); public releases are tagged, published as GitHub Releases and shipped to the Chrome Web Store.

## [1.1.0] - 2026-09-25

### Added

- **Due dates** — a calendar glyph at the right end of every active task opens a date & time sheet: Today / Tomorrow / Next week shortcuts, a month calendar (arrow keys move between days), a time field and a **time zone** picker that defaults to your own zone. Tasks show a label — _Due Today, 5:30 PM_, _Due Tomorrow…_, or red _Overdue_ — tinted amber when due within a day. A task due in another zone shows that zone's time with its offset (e.g. _GMT+9_).
- **User manual** (opens [theysap.com/extensions/liquid-do](https://theysap.com/extensions/liquid-do/#manual)) and **Report an issue** links at the very bottom of the popup, with the version number.
- **Store asset pipeline** (like GlassTube's): `npm run release:local` builds `chrome/vX.Y.Z/` with the store zip, five 1280×800 screenshots, 440×280 and 1400×560 promo tiles, the 128 px store icon, 4K logo masters, the listing copy and the privacy policy — rendered from the real extension. `chrome/` is git-ignored.
- Tooling: ESLint, Stylelint, Prettier, unit tests, a validator, husky hooks (commit subjects are exactly `vX.Y.Z`), CI and a release workflow that publishes notes only — no zip.

### Changed

- **No network requests at all**: the Lora and Nunito fonts are bundled, and a strict content security policy blocks anything remote. The validator fails the build if a remote resource sneaks back in.
- **New icon everywhere**: the toolbar and store icons are now rendered from the checklist mark in the popup header (with a bolder variant for 16–32 px), replacing the old listing icon.
- **Rounded type**: everything except the _LiquidDo_ wordmark (still Lora Italic) now uses Nunito.
- **One corner radius** (14 px) for every element — header, tabs, input, tasks, buttons, checkboxes, the due date sheet.
- Long lists scroll inside the popup, so the header and bottom links stay in view.
- Only newly added tasks animate in; ticking or editing a task no longer replays the animation for the whole list.
- The extension source now lives in `src/` (load that folder unpacked).

## [1.0.0] - 2026-06-09

The first public release of LiquidDo — a Liquid Glass to-do list in your browser toolbar, as published on the [Chrome Web Store](https://chromewebstore.google.com/detail/alacajgllgfcbcbggeokhdapaopjgldc).

### Highlights

- **Add tasks** from the toolbar popup with <kbd>Enter</kbd> or the ＋ button (up to 120 characters each).
- **Active and Completed tabs** — tick a task to move it to Completed, tick it again to bring it back.
- **Delete** a single task, or **Clear all completed** in one go.
- **Relative timestamps** — "just now", "5m ago", "Completed 2h ago".
- **Live task count** in the header ("3 tasks", "All done!").
- **Liquid Glass design** with the Lora typeface.
- **Private by design** — tasks are stored only on your computer with `chrome.storage.local`; the only permission is `storage`.

### Project

- Repository set up with a README, user manual, privacy policy, changelog, MIT license and GitHub issue / pull-request templates.

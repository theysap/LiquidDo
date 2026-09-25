# LiquidDo — Chrome Web Store listing (v{{version}})

Copy/paste reference for the Chrome Web Store Developer Dashboard.

## Package

- **Upload:** `liquiddo-v{{version}}.zip`

## Store listing

- **Name:** LiquidDo – To-Do List
- **Summary (≤132 chars):** A beautiful Liquid Glass to-do list. Add tasks, set due dates in your time zone, and tick them off from your toolbar.
- **Category:** Productivity → Workflow & Planning
- **Language:** English

### Description

LiquidDo is a calm, beautiful to-do list that lives in your Chrome toolbar. Click the icon, type a task, press Enter — done.

★ One click away
The popup opens with the cursor ready in the task box. New tasks land at the top of your list.

★ Due dates in your time zone
Tap the calendar glyph on any task to pick a day and time — Today, Tomorrow and Next week are one tap away. Dates use your own time zone by default, or pick any time zone in the world for that call with a colleague abroad.

★ See what's due at a glance
Every task wears a clear label: due later, due within a day, or overdue.

★ Tick it off, bring it back
Completed tasks move to their own tab, where you can restore them or clear them all at once.

★ Liquid Glass design
Frosted glass, soft gradients, rounded type and one consistent shape language throughout.

Privacy: LiquidDo has no accounts, no analytics and no servers. Your tasks are stored only on your computer and the extension makes no network requests at all — even its fonts are bundled.

### Graphic assets (in this folder)

Sizes follow the [Chrome Web Store image guidelines](https://developer.chrome.com/docs/webstore/images). All screenshots and tiles are opaque 24-bit PNGs.

| Dashboard field                    | File                                                                 | Size              | Required                        |
| ---------------------------------- | -------------------------------------------------------------------- | ----------------- | ------------------------------- |
| Store icon                         | `store-icon-128x128.png` (96 px artwork + 16 px transparent padding) | 128×128           | Yes                             |
| Screenshots (upload in this order) | `screenshot-1-*.png` … `screenshot-5-*.png`                          | 1280×800          | 1–5                             |
| Small promo tile                   | `promo-small-440x280.png`                                            | 440×280           | Yes                             |
| Marquee promo tile                 | `promo-marquee-1400x560.png`                                         | 1400×560          | Optional (needed for featuring) |
| Logo masters (press / social)      | `brand/liquiddo-logo-4096.png`, `-1024.png`, `-512.png`              | 4096 / 1024 / 512 | —                               |

## Privacy practices

- **Single purpose:** A to-do list in the browser toolbar: add, schedule, complete and delete tasks.
- **Permission — `storage`:** Saves the user's tasks (text, done state, created / completed / due times and the chosen time zone) with `chrome.storage.local` on their computer.
- **Host permissions:** None.
- **Remote code:** No. All code and fonts ship inside the package; the popup's content security policy blocks every network request.
- **Data usage:** LiquidDo does not collect or transmit any user data. Tick none of the data categories.
- **Certifications:** No sale of data · no unrelated use · no creditworthiness use.
- **Privacy policy URL:** https://github.com/theysap/LiquidDo/blob/master/PRIVACY.md

## Test instructions for the reviewer

No account or setup needed. Click the LiquidDo toolbar icon, type a task and press Enter. Click the calendar glyph at the right of the task to set a due date and time (optionally in another time zone), then save. Tick the circle to complete it and open the Completed tab.

## What's new in v{{version}}

{{changes}}

# LiquidDo User Manual

Everything you need to get the most out of LiquidDo — what each part of the popup does, due dates and time zones, shortcuts, known issues and how to report a problem.

> [!IMPORTANT]
> **Found a problem? Please tell us — it's the fastest way it gets fixed.**
>
> 1. Open **[github.com/theysap/LiquidDo/issues/new/choose](https://github.com/theysap/LiquidDo/issues/new/choose)** (or click **Report an issue** at the bottom of the LiquidDo popup).
> 2. Pick **Bug report** (something is broken) or **Feature request** (an idea).
> 3. Tell us **what you did**, **what you expected**, **what happened**, and your **LiquidDo and Chrome versions** (LiquidDo's version is at the bottom-right of the popup; Chrome's is at `chrome://settings/help`).
> 4. A screenshot helps a lot — **please blur any personal task text**.
>
> Issues are public — don't include private details from your tasks.

---

## Contents

- [Getting started](#getting-started)
- [The popup at a glance](#the-popup-at-a-glance)
- [Adding tasks](#adding-tasks)
- [Due dates and time zones](#due-dates-and-time-zones)
- [Completing tasks](#completing-tasks)
- [Deleting tasks](#deleting-tasks)
- [Keyboard shortcuts](#keyboard-shortcuts)
- [Where your tasks are kept](#where-your-tasks-are-kept)
- [Known issues & what to expect](#known-issues--what-to-expect)
- [Troubleshooting checklist](#troubleshooting-checklist)
- [FAQ](#faq)
- [How to report an issue](#how-to-report-an-issue)

---

## Getting started

1. Install LiquidDo from the [Chrome Web Store](https://chromewebstore.google.com/detail/alacajgllgfcbcbggeokhdapaopjgldc) (or run it from source — see the [README](README.md#install)).
2. Pin it: click the puzzle-piece icon in Chrome's toolbar and pin **LiquidDo** so it's one click away.
3. Click the LiquidDo icon. The popup opens with the cursor already in the task box — start typing.

---

## The popup at a glance

| Part                    | What it does                                                                                                                                           |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Header**              | The LiquidDo name and a live count of your active tasks — "1 task", "4 tasks", or **All done!** when none are left.                                    |
| **Active tab**          | Tasks you still have to do, newest first, with the task box at the top.                                                                                |
| **Completed tab**       | Tasks you've ticked off, each showing when it was completed. The task box is hidden here.                                                              |
| **Task box and ＋**     | Type a task and press <kbd>Enter</kbd> or click ＋ to add it.                                                                                          |
| **Circle (checkbox)**   | Marks a task complete — or, on the Completed tab, brings it back to Active.                                                                            |
| **Calendar glyph**      | At the right end of every active task: set, change or remove its due date. It turns amber or red as the date nears.                                    |
| **✕ on a task**         | Appears when you hover a task; deletes it.                                                                                                             |
| **Clear all completed** | Shown at the bottom of the Completed tab when it has tasks; removes every completed task.                                                              |
| **Bottom bar**          | **User manual** (opens this manual on [theysap.com](https://theysap.com/extensions/liquid-do/#manual)), **Report an issue**, and the LiquidDo version. |

Under each task is a small line with its due-date label (if it has one) and when it was added ("just now", "12m ago", "3h ago", "2d ago") — or, for completed tasks, when it was finished ("Completed 1h ago"). When the list is longer than the popup, it scrolls; the header and bottom bar stay in place.

---

## Adding tasks

- Type in **Add a new task…** and press <kbd>Enter</kbd> or click **＋**.
- Tasks can be up to **120 characters**; extra typing is ignored.
- Leading and trailing spaces are trimmed. An empty task isn't added.
- New tasks appear at the **top** of the Active list.

## Due dates and time zones

Click the **calendar glyph** at the right end of a task. A sheet slides up:

| Part                               | What it does                                                                                                                                        |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Today / Tomorrow / Next week**   | Picks that day in one click (the chip lights up when it matches the selected day).                                                                  |
| **Calendar**                       | Pick any day; ‹ › change month. Today is outlined. The week starts on the day your browser's language uses.                                         |
| **Time**                           | The time of day. New due dates start at the next full hour.                                                                                         |
| **Time zone**                      | Defaults to **your time zone** (from your computer). Choose any other zone — e.g. a meeting in Tokyo — and the date and time are read in that zone. |
| **Preview line**                   | Shows exactly what the task will say, e.g. _Due Tomorrow, 9:00 AM_, and warns you if that time has already passed.                                  |
| **Set due date / Update due date** | Saves. <kbd>Enter</kbd> in the time field does the same.                                                                                            |
| **Remove**                         | Clears the task's due date (only available when it has one).                                                                                        |

Close the sheet without saving with **✕**, a click outside it, or <kbd>Esc</kbd>.

**How labels read**

| Label                                | Meaning                                                                    |
| ------------------------------------ | -------------------------------------------------------------------------- |
| _Due Today, 5:30 PM_ (amber)         | Due within the next 24 hours.                                              |
| _Due Monday, 9:00 AM_ (purple)       | Due later. Dates within a week show the weekday; further out, the date.    |
| _Overdue · Yesterday, 6:00 PM_ (red) | The due time has passed.                                                   |
| _… 10:00 AM GMT+9_                   | The task was set in another time zone; its time is shown in **that** zone. |

Times follow your browser's language (12- or 24-hour clock). Changing the time zone in the sheet keeps the date and time you entered and reads them in the new zone.

## Completing tasks

- Click the **circle** next to a task. It moves to the **Completed** tab and the header count goes down. Its due date is kept.
- Changed your mind? Open **Completed** and click the circle again — the task returns to **Active**.

## Deleting tasks

- Hover a task and click the **✕** to delete it (on either tab).
- On the **Completed** tab, **Clear all completed** removes every completed task at once.

> [!WARNING]
> Deleting is permanent — there is no undo or trash. Completing a task instead keeps it on the Completed tab until you clear it.

---

## Keyboard shortcuts

| Key                                                 | What it does                                                           |
| --------------------------------------------------- | ---------------------------------------------------------------------- |
| <kbd>Enter</kbd>                                    | Add the task (in the task box) · save the due date (in the time field) |
| <kbd>Esc</kbd>                                      | Clear what you've typed (task box) · close the due date sheet          |
| <kbd>←</kbd> <kbd>→</kbd> <kbd>↑</kbd> <kbd>↓</kbd> | Move between days in the calendar                                      |
| <kbd>Tab</kbd>                                      | Move between the tabs, the task box, tasks and buttons                 |

Tip: set a shortcut to open the popup itself at `chrome://extensions/shortcuts` → **LiquidDo** → _Activate the extension_.

---

## Where your tasks are kept

Tasks are saved **on this computer, in this Chrome profile** (`chrome.storage.local`) the moment you add, schedule, complete or delete one. They stay after you close the popup or restart Chrome.

- They **don't sync** to your other computers or Chrome profiles.
- **Removing the extension deletes your tasks.**
- LiquidDo makes **no network requests** — even its fonts are built in. See the [privacy policy](PRIVACY.md).

---

## Known issues & what to expect

- **No reminders or notifications (yet).** A due date is a label; LiquidDo won't pop up an alert when it arrives.
- **Tasks are per computer and per Chrome profile.** A second device or profile starts with an empty list.
- **Uninstalling removes all tasks**, and there's no export yet — copy anything important somewhere else first.
- **No editing or reordering yet.** To change a task's text, delete it and add it again (due dates can be changed any time).
- **Labels update when you open the popup**, not while it stays open — reopen it to refresh "Due Today" / "Overdue".
- **Your zone may appear under an older name** (e.g. _Asia/Calcutta_ instead of _Asia/Kolkata_) — that's how Chrome reports it; both are the same zone.
- **Characters beyond Latin scripts** (e.g. Cyrillic, Greek, CJK, emoji) use your system font instead of the built-in rounded font.

## Troubleshooting checklist

| Problem                          | Fix                                                                                                                      |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Icon isn't in the toolbar        | Click the puzzle-piece icon and pin **LiquidDo**; check it's enabled at `chrome://extensions`.                           |
| Tasks disappeared                | Check you're in the same Chrome profile. If the extension was removed and reinstalled, earlier tasks can't be recovered. |
| A task seems missing             | Look on the **Completed** tab — it may have been ticked off.                                                             |
| A due time looks an hour off     | Open the task's due date sheet and check its time zone — it may be set in another zone (look for a _GMT±…_ suffix).      |
| "Due Today" still shows tomorrow | Close and reopen the popup; labels refresh each time it opens.                                                           |
| Something else                   | Close and reopen the popup, then [report it](#how-to-report-an-issue).                                                   |

## FAQ

**Does LiquidDo collect my data?** No. No analytics, no servers, no tracking, no network requests. Your tasks stay on your computer. See the [privacy policy](PRIVACY.md).

**Does it read the websites I visit?** No. Its only permission is `storage`; it has no access to web pages.

**How does it know my time zone?** From your computer's settings, via the browser — nothing is looked up online.

**Can I use it on several computers?** Each computer (and Chrome profile) keeps its own list; tasks don't sync.

**Does it work in other browsers?** It's built for Chrome; other Chromium browsers (Edge, Brave, Arc) generally work.

---

## How to report an issue

> [!IMPORTANT]
> **Raising an issue takes two minutes:**
>
> 1. Go to **[github.com/theysap/LiquidDo/issues/new/choose](https://github.com/theysap/LiquidDo/issues/new/choose)** — or click **Report an issue** at the bottom of the LiquidDo popup.
> 2. Choose **Bug report** or **Feature request**.
> 3. Include the **steps** to see the problem, **what you expected** vs **what happened**, and your **LiquidDo + Chrome versions**. For due-date problems, mention the **time zone** you picked and your computer's time zone.
> 4. Add a **screenshot or short screen recording** — blur any personal task text.
>
> 🔒 Issues are public — never paste private details from your tasks.

# LiquidDo User Manual

Everything you need to get the most out of LiquidDo — what each part of the popup does, shortcuts, known issues and how to report a problem.

> [!IMPORTANT]
> **Found a problem? Please tell us — it's the fastest way it gets fixed.**
>
> 1. Open **[github.com/theysap/LiquidDo/issues/new/choose](https://github.com/theysap/LiquidDo/issues/new/choose)**.
> 2. Pick **Bug report** (something is broken) or **Feature request** (an idea).
> 3. Tell us **what you did**, **what you expected**, **what happened**, and your **LiquidDo and Chrome versions** (LiquidDo's version is on its card at `chrome://extensions`; Chrome's is at `chrome://settings/help`).
> 4. A screenshot helps a lot — **please blur any personal task text**.
>
> Issues are public — don't include private details from your tasks.

---

## Contents

- [Getting started](#getting-started)
- [The popup at a glance](#the-popup-at-a-glance)
- [Adding tasks](#adding-tasks)
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

| Part                    | What it does                                                                                                         |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Header**              | The LiquidDo name and a live count of your active tasks — "1 task", "4 tasks", or **All done!** when none are left. |
| **Active tab**          | Tasks you still have to do, newest first, with the task box at the top.                                              |
| **Completed tab**       | Tasks you've ticked off, each showing when it was completed. The task box is hidden here.                            |
| **Task box and ＋**     | Type a task and press <kbd>Enter</kbd> or click ＋ to add it.                                                        |
| **Circle (checkbox)**   | Marks a task complete — or, on the Completed tab, brings it back to Active.                                          |
| **✕ on a task**         | Deletes that task.                                                                                                   |
| **Clear all completed** | Shown at the bottom of the Completed tab when it has tasks; removes every completed task.                            |

Under each task is a small timestamp: when it was added ("just now", "12m ago", "3h ago", "2d ago") or, for completed tasks, when it was finished ("Completed 1h ago").

---

## Adding tasks

- Type in **Add a new task…** and press <kbd>Enter</kbd> or click **＋**.
- Tasks can be up to **120 characters**; extra typing is ignored.
- Leading and trailing spaces are trimmed. An empty task isn't added.
- New tasks appear at the **top** of the Active list.

## Completing tasks

- Click the **circle** next to a task. It moves to the **Completed** tab and the header count goes down.
- Changed your mind? Open **Completed** and click the circle again — the task returns to **Active**.

## Deleting tasks

- Click the **✕** on a task to delete it (on either tab).
- On the **Completed** tab, **Clear all completed** removes every completed task at once.

> [!WARNING]
> Deleting is permanent — there is no undo or trash. Completing a task instead keeps it on the Completed tab until you clear it.

---

## Keyboard shortcuts

| Key              | What it does                                     |
| ---------------- | ------------------------------------------------ |
| <kbd>Enter</kbd> | Add the task (in the task box)                   |
| <kbd>Esc</kbd>   | Clear what you've typed (in the task box)        |
| <kbd>Tab</kbd>   | Move between the tabs, the task box and buttons  |

Tip: set a shortcut to open the popup itself at `chrome://extensions/shortcuts` → **LiquidDo** → _Activate the extension_.

---

## Where your tasks are kept

Tasks are saved **on this computer, in this Chrome profile** (`chrome.storage.local`) the moment you add, complete or delete one. They stay after you close the popup or restart Chrome.

- They **don't sync** to your other computers or Chrome profiles.
- **Removing the extension deletes your tasks.**
- Nothing is sent to any server. See the [privacy policy](PRIVACY.md).

---

## Known issues & what to expect

- **Tasks are per computer and per Chrome profile.** A second device or profile starts with an empty list.
- **Uninstalling removes all tasks**, and there's no export yet — copy anything important somewhere else first.
- **No editing or reordering yet.** To change a task, delete it and add it again.
- **The font needs the internet the first time.** LiquidDo loads the Lora typeface from Google Fonts; offline (before the font is cached) the popup falls back to a system serif font. Everything else works offline.
- **Timestamps update when you open the popup**, not while it stays open.

## Troubleshooting checklist

| Problem                                | Fix                                                                                                                  |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Icon isn't in the toolbar              | Click the puzzle-piece icon and pin **LiquidDo**; check it's enabled at `chrome://extensions`.                     |
| Tasks disappeared                      | Check you're in the same Chrome profile. If the extension was removed and reinstalled, earlier tasks can't be recovered. |
| A task seems missing                   | Look on the **Completed** tab — it may have been ticked off.                                                        |
| Text looks different / plain           | You're probably offline and the Lora font hasn't loaded; it returns once you're online.                             |
| Something else                         | Close and reopen the popup, then [report it](#how-to-report-an-issue).                                              |

## FAQ

**Does LiquidDo collect my data?** No. No analytics, no servers, no tracking. Your tasks stay on your computer. See the [privacy policy](PRIVACY.md).

**Does it read the websites I visit?** No. Its only permission is `storage`; it has no access to web pages.

**Can I use it on several computers?** Each computer (and Chrome profile) keeps its own list; tasks don't sync.

**Does it work in other browsers?** It's built for Chrome; other Chromium browsers (Edge, Brave, Arc) generally work.

---

## How to report an issue

> [!IMPORTANT]
> **Raising an issue takes two minutes:**
>
> 1. Go to **[github.com/theysap/LiquidDo/issues/new/choose](https://github.com/theysap/LiquidDo/issues/new/choose)**.
> 2. Choose **Bug report** or **Feature request**.
> 3. Include the **steps** to see the problem, **what you expected** vs **what happened**, and your **LiquidDo + Chrome versions**.
> 4. Add a **screenshot or short screen recording** — blur any personal task text.
>
> 🔒 Issues are public — never paste private details from your tasks.

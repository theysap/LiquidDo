'use strict';

const {
  uid,
  timeAgo,
  escapeHtml,
  localZone,
  zonedParts,
  zonedToEpoch,
  dayDiff,
  addDays,
  offsetLabel,
  timeZones,
  describeDue,
} = window.LiquidDoTasks;

let tasks = [];
let currentTab = 'active';
let enteringId = null;

const $ = (id) => document.getElementById(id);
// Dates and times follow the browser's language (12/24-hour clock, month names, week start).
const LOCALE = navigator.language;

// ── STORAGE ──────────────────────────────────────────────

const hasChromeStorage = typeof chrome !== 'undefined' && !!chrome.storage;

function loadTasks(cb) {
  if (hasChromeStorage) {
    chrome.storage.local.get(['liquiddo_tasks'], (res) => {
      tasks = res.liquiddo_tasks || [];
      cb();
    });
  } else {
    const raw = localStorage.getItem('liquiddo_tasks');
    tasks = raw ? JSON.parse(raw) : [];
    cb();
  }
}

function saveTasks() {
  if (hasChromeStorage) {
    chrome.storage.local.set({ liquiddo_tasks: tasks });
  } else {
    localStorage.setItem('liquiddo_tasks', JSON.stringify(tasks));
  }
}

// ── RENDER ────────────────────────────────────────────────

const CALENDAR_ICON = `
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="2" y="3" width="12" height="11" rx="3" stroke="currentColor" stroke-width="1.5"/>
    <path d="M2.5 6.5h11M5.5 1.75v2.5M10.5 1.75v2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M8 8.6v1.9l1.2.8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

const DELETE_ICON = `
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
  </svg>`;

function taskMeta(task, now) {
  if (task.done) {
    return `<span>${task.completedAt ? `Completed ${timeAgo(task.completedAt, now)}` : 'Completed'}</span>`;
  }
  const added = `<span>${timeAgo(task.createdAt, now)}</span>`;
  if (!task.dueAt) return added;
  const due = describeDue(task.dueAt, task.tz, { now, locale: LOCALE });
  const prefix = due.state === 'overdue' ? 'Overdue · ' : 'Due ';
  return `<span class="due-tag ${due.state}">${prefix}${escapeHtml(due.label)}</span>${added}`;
}

function render() {
  const list = $('tasksList');
  const now = Date.now();
  const activeTasks = tasks.filter((t) => !t.done);
  const doneTasks = tasks.filter((t) => t.done);
  const shown = currentTab === 'active' ? activeTasks : doneTasks;

  const c = activeTasks.length;
  $('taskCount').textContent = c === 0 ? 'All done!' : c === 1 ? '1 task' : `${c} tasks`;

  $('footer').hidden = !(currentTab === 'completed' && doneTasks.length > 0);
  $('inputSection').hidden = currentTab !== 'active';

  if (shown.length === 0) {
    list.innerHTML = '';
    $('emptyState').hidden = false;
    const allDone = activeTasks.length === 0 && doneTasks.length > 0;
    if (currentTab === 'active') {
      $('emptyTitle').textContent = allDone ? 'All done!' : 'No tasks yet';
      $('emptySub').textContent = allDone
        ? 'Every task is completed. Nice work!'
        : 'Add a task above to get started.';
    } else {
      $('emptyTitle').textContent = 'Nothing completed yet';
      $('emptySub').textContent = 'Finished tasks will appear here.';
    }
    return;
  }

  $('emptyState').hidden = true;
  list.innerHTML = '';

  for (const task of shown) {
    const item = document.createElement('div');
    item.className = `task-item${task.done ? ' completed' : ''}${task.id === enteringId ? ' entering' : ''}`;
    item.dataset.id = task.id;

    let dueButton = '';
    if (!task.done) {
      const due = task.dueAt ? describeDue(task.dueAt, task.tz, { now, locale: LOCALE }) : null;
      const label = due ? `Change due date (${due.label})` : 'Set due date';
      dueButton = `
        <button class="row-btn due-btn${due ? ` has-due ${due.state}` : ''}" data-action="due" aria-label="${escapeHtml(label)}" title="${escapeHtml(label)}">
          ${CALENDAR_ICON}
        </button>`;
    }

    item.innerHTML = `
      <button class="check-btn${task.done ? ' checked' : ''}" data-action="toggle" aria-label="${task.done ? 'Mark incomplete' : 'Mark complete'}"></button>
      <div class="task-body">
        <div class="task-text">${escapeHtml(task.text)}</div>
        <div class="task-meta">${taskMeta(task, now)}</div>
      </div>
      <button class="row-btn delete-btn" data-action="delete" aria-label="Delete task" title="Delete task">
        ${DELETE_ICON}
      </button>
      ${dueButton}
    `;
    list.appendChild(item);
  }
  enteringId = null;
}

// ── ACTIONS ───────────────────────────────────────────────

function addTask() {
  const input = $('taskInput');
  const text = input.value.trim();
  if (!text) {
    input.focus();
    return;
  }
  const task = { id: uid(), text, done: false, createdAt: Date.now() };
  tasks.unshift(task);
  enteringId = task.id;
  saveTasks();
  input.value = '';
  render();
  input.focus();
}

function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;
  task.done = !task.done;
  task.completedAt = task.done ? Date.now() : null;
  saveTasks();
  render();
}

function removeTask(id) {
  const item = document.querySelector(`[data-id="${CSS.escape(id)}"]`);
  if (!item) return;
  item.classList.add('removing');
  setTimeout(() => {
    tasks = tasks.filter((t) => t.id !== id);
    saveTasks();
    render();
  }, 230);
}

function clearCompleted() {
  document.querySelectorAll('.task-item.completed').forEach((el) => el.classList.add('removing'));
  setTimeout(() => {
    tasks = tasks.filter((t) => !t.done);
    saveTasks();
    render();
  }, 250);
}

function switchTab(tab) {
  currentTab = tab;
  for (const [id, name] of [
    ['tabActive', 'active'],
    ['tabCompleted', 'completed'],
  ]) {
    $(id).classList.toggle('active', tab === name);
    $(id).setAttribute('aria-selected', String(tab === name));
  }
  render();
}

// ── DUE DATE SHEET ────────────────────────────────────────

/** The sheet being edited: task id, zone, picked date/time and the month shown. */
let editing = null;
let zonesFilled = false;

const pad2 = (n) => String(n).padStart(2, '0');
const sameDate = (a, b) =>
  !!a && !!b && a.year === b.year && a.month === b.month && a.day === b.day;

/** Monday (1) … Sunday (7), from the browser's locale when it says. */
function firstDayOfWeek() {
  try {
    const locale = new Intl.Locale(LOCALE);
    const info = locale.getWeekInfo?.() || locale.weekInfo;
    if (info?.firstDay) return info.firstDay;
  } catch {
    /* fall through */
  }
  return 7;
}

function fillZones() {
  if (zonesFilled) return;
  zonesFilled = true;
  const select = $('dueZone');
  const local = localZone();
  const option = (tz) => new Option(`${tz.replace(/_/g, ' ')} (${offsetLabel(tz)})`, tz);
  const mine = document.createElement('optgroup');
  mine.label = 'Your time zone';
  mine.append(option(local));
  const all = document.createElement('optgroup');
  all.label = 'All time zones';
  for (const tz of timeZones(local)) if (tz !== local) all.append(option(tz));
  select.append(mine, all);

  // Week-day initials in locale order.
  const first = firstDayOfWeek();
  const fmt = new Intl.DateTimeFormat(LOCALE, { weekday: 'narrow', timeZone: 'UTC' });
  $('calWeek').innerHTML = Array.from({ length: 7 }, (_, i) => {
    const iso = ((first - 1 + i) % 7) + 1; // 1 = Monday
    // 2024-01-01 was a Monday.
    return `<span>${fmt.format(Date.UTC(2024, 0, iso))}</span>`;
  }).join('');
}

function openDueSheet(id, opener) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;
  fillZones();

  const tz = task.tz || localZone();
  let picked;
  if (task.dueAt) {
    picked = zonedParts(task.dueAt, tz);
  } else {
    // Default: the next full hour, in the chosen zone.
    const nextHour = Math.ceil((Date.now() + 60000) / 3600000) * 3600000;
    picked = zonedParts(nextHour, tz);
  }
  editing = {
    id,
    opener,
    tz,
    date: { year: picked.year, month: picked.month, day: picked.day },
    view: { year: picked.year, month: picked.month },
    hadDue: !!task.dueAt,
  };

  $('dueTask').textContent = task.text;
  $('dueTime').value = `${pad2(picked.hour)}:${pad2(picked.minute)}`;
  $('dueZone').value = tz;
  $('dueRemove').disabled = !task.dueAt;
  $('dueSave').textContent = task.dueAt ? 'Update due date' : 'Set due date';
  document.body.classList.add('sheet-open');
  $('dueSheet').hidden = false;
  renderSheet();
  document.querySelector('#calGrid .selected')?.focus();
}

function closeDueSheet() {
  if (!editing) return;
  const opener = editing.opener;
  editing = null;
  $('dueSheet').hidden = true;
  document.body.classList.remove('sheet-open');
  if (opener?.isConnected) opener.focus();
}

function todayIn(tz) {
  const p = zonedParts(Date.now(), tz);
  return { year: p.year, month: p.month, day: p.day };
}

/** The picked instant, or null while the time field is incomplete. */
function pickedEpoch() {
  const [hour, minute] = $('dueTime').value.split(':').map(Number);
  if (!editing || Number.isNaN(hour) || Number.isNaN(minute)) return null;
  return zonedToEpoch({ ...editing.date, hour, minute }, editing.tz);
}

function renderSheet() {
  const { view, date, tz } = editing;
  const today = todayIn(tz);

  $('calMonth').textContent = new Intl.DateTimeFormat(LOCALE, {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(Date.UTC(view.year, view.month - 1, 1));

  // Six weeks starting on the locale's first weekday on or before the 1st.
  const first = { year: view.year, month: view.month, day: 1 };
  const isoDow = ((new Date(Date.UTC(view.year, view.month - 1, 1)).getUTCDay() + 6) % 7) + 1;
  const lead = (isoDow - firstDayOfWeek() + 7) % 7;
  const start = addDays(first, -lead);
  const cells = [];
  for (let i = 0; i < 42; i++) {
    const d = addDays(start, i);
    const cls = ['cal-day'];
    if (d.month !== view.month) cls.push('outside');
    if (dayDiff(today, d) < 0) cls.push('past');
    if (sameDate(d, today)) cls.push('today');
    const selected = sameDate(d, date);
    if (selected) cls.push('selected');
    const label = new Intl.DateTimeFormat(LOCALE, {
      dateStyle: 'full',
      timeZone: 'UTC',
    }).format(Date.UTC(d.year, d.month - 1, d.day));
    cells.push(
      `<button class="${cls.join(' ')}" data-date="${d.year}-${d.month}-${d.day}" role="gridcell" aria-label="${label}" aria-selected="${selected}" tabindex="${selected ? 0 : -1}">${d.day}</button>`,
    );
  }
  $('calGrid').innerHTML = cells.join('');

  // Quick chips light up when they match the picked date.
  document.querySelectorAll('.chip').forEach((chip) => {
    chip.classList.toggle('selected', sameDate(addDays(today, Number(chip.dataset.quick)), date));
  });

  const ts = pickedEpoch();
  const preview = $('duePreview');
  if (ts == null) {
    preview.textContent = 'Pick a time.';
    preview.classList.remove('overdue');
    $('dueSave').disabled = true;
    return;
  }
  $('dueSave').disabled = false;
  const due = describeDue(ts, tz, { locale: LOCALE });
  preview.textContent =
    due.state === 'overdue' ? `${due.label} — that's in the past` : `Due ${due.label}`;
  preview.classList.toggle('overdue', due.state === 'overdue');
}

function pickDate(date, { focus = false } = {}) {
  editing.date = date;
  editing.view = { year: date.year, month: date.month };
  renderSheet();
  if (focus) document.querySelector('#calGrid .selected')?.focus();
}

function shiftMonth(delta) {
  const m = editing.view.month - 1 + delta;
  editing.view = {
    year: editing.view.year + Math.floor(m / 12),
    month: (((m % 12) + 12) % 12) + 1,
  };
  renderSheet();
}

function saveDue() {
  const ts = pickedEpoch();
  const task = tasks.find((t) => t.id === editing?.id);
  if (ts == null || !task) return;
  task.dueAt = ts;
  task.tz = editing.tz;
  saveTasks();
  closeDueSheet();
  render();
}

function removeDue() {
  const task = tasks.find((t) => t.id === editing?.id);
  if (!task) return;
  delete task.dueAt;
  delete task.tz;
  saveTasks();
  closeDueSheet();
  render();
}

// ── INIT ──────────────────────────────────────────────────

loadTasks(() => {
  render();
  $('taskInput').focus();

  if (hasChromeStorage && chrome.runtime?.getManifest) {
    $('version').textContent = `v${chrome.runtime.getManifest().version}`;
  }

  $('tabActive').addEventListener('click', () => switchTab('active'));
  $('tabCompleted').addEventListener('click', () => switchTab('completed'));
  $('addBtn').addEventListener('click', addTask);
  $('clearBtn').addEventListener('click', clearCompleted);

  // Event delegation for the task list (toggle, delete, due date).
  $('tasksList').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    const item = btn?.closest('.task-item');
    if (!item) return;
    const id = item.dataset.id;
    if (btn.dataset.action === 'toggle') toggleTask(id);
    else if (btn.dataset.action === 'delete') removeTask(id);
    else if (btn.dataset.action === 'due') openDueSheet(id, btn);
  });

  $('taskInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTask();
    if (e.key === 'Escape') {
      e.target.value = '';
      e.target.blur();
    }
  });

  // Due date sheet.
  $('dueSheet').addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) closeDueSheet();
  });
  $('calPrev').addEventListener('click', () => shiftMonth(-1));
  $('calNext').addEventListener('click', () => shiftMonth(1));
  $('calGrid').addEventListener('click', (e) => {
    const cell = e.target.closest('[data-date]');
    if (!cell) return;
    const [year, month, day] = cell.dataset.date.split('-').map(Number);
    pickDate({ year, month, day }, { focus: true });
  });
  $('calGrid').addEventListener('keydown', (e) => {
    const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
    if (!step) return;
    e.preventDefault();
    pickDate(addDays(editing.date, step), { focus: true });
  });
  document
    .querySelectorAll('.chip')
    .forEach((chip) =>
      chip.addEventListener('click', () =>
        pickDate(addDays(todayIn(editing.tz), Number(chip.dataset.quick))),
      ),
    );
  $('dueTime').addEventListener('input', renderSheet);
  $('dueZone').addEventListener('change', (e) => {
    // Keep the wall-clock date and time; read them in the newly chosen zone.
    editing.tz = e.target.value;
    renderSheet();
  });
  $('dueSave').addEventListener('click', saveDue);
  $('dueRemove').addEventListener('click', removeDue);

  document.addEventListener('keydown', (e) => {
    if (!editing) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      closeDueSheet();
    } else if (e.key === 'Enter' && e.target.id === 'dueTime') {
      saveDue();
    }
  });
});

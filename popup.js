'use strict';

let tasks = [];
let currentTab = 'active';

// ── STORAGE ──────────────────────────────────────────────

function loadTasks(cb) {
  if (typeof chrome !== 'undefined' && chrome.storage) {
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
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.local.set({ liquiddo_tasks: tasks });
  } else {
    localStorage.setItem('liquiddo_tasks', JSON.stringify(tasks));
  }
}

// ── UTILS ─────────────────────────────────────────────────

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── RENDER ────────────────────────────────────────────────

function render() {
  const list = document.getElementById('tasksList');
  const emptyState = document.getElementById('emptyState');
  const footer = document.getElementById('footer');
  const inputSection = document.getElementById('inputSection');
  const taskCount = document.getElementById('taskCount');

  const activeTasks = tasks.filter(t => !t.done);
  const doneTasks = tasks.filter(t => t.done);
  const shown = currentTab === 'active' ? activeTasks : doneTasks;

  // Update count
  const c = activeTasks.length;
  taskCount.textContent = c === 0 ? 'All done!' : c === 1 ? '1 task' : `${c} tasks`;

  // Show/hide footer and input
  footer.style.display = (currentTab === 'completed' && doneTasks.length > 0) ? 'block' : 'none';
  inputSection.style.display = currentTab === 'active' ? 'block' : 'none';

  // Empty state
  if (shown.length === 0) {
    list.innerHTML = '';
    emptyState.style.display = 'flex';
    const et = document.getElementById('emptyTitle');
    const es = document.getElementById('emptySub');
    if (currentTab === 'active') {
      et.textContent = activeTasks.length === 0 && doneTasks.length > 0 ? 'All done!' : 'No tasks yet';
      es.textContent = activeTasks.length === 0 && doneTasks.length > 0 ? 'Every task is completed. Nice work!' : 'Add a task above to get started.';
    } else {
      et.textContent = 'Nothing completed yet';
      es.textContent = 'Finished tasks will appear here.';
    }
    return;
  }

  emptyState.style.display = 'none';
  list.innerHTML = '';

  shown.forEach(task => {
    const item = document.createElement('div');
    item.className = `task-item${task.done ? ' completed' : ''}`;
    item.dataset.id = task.id;

    const metaText = task.done && task.completedAt
      ? `Completed ${timeAgo(task.completedAt)}`
      : timeAgo(task.createdAt);

    item.innerHTML = `
      <button class="check-btn${task.done ? ' checked' : ''}" data-action="toggle" aria-label="${task.done ? 'Mark incomplete' : 'Mark complete'}"></button>
      <div style="flex:1; min-width:0;">
        <div class="task-text">${escapeHtml(task.text)}</div>
        <div class="task-meta">${metaText}</div>
      </div>
      <button class="delete-btn" data-action="delete" aria-label="Delete task">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </button>
    `;

    list.appendChild(item);
  });
}

// ── ACTIONS ───────────────────────────────────────────────

function addTask() {
  const input = document.getElementById('taskInput');
  const text = input.value.trim();
  if (!text) {
    input.focus();
    return;
  }

  const task = {
    id: uid(),
    text,
    done: false,
    createdAt: Date.now()
  };

  tasks.unshift(task);
  saveTasks();
  input.value = '';
  render();
  input.focus();
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  task.done = !task.done;
  task.completedAt = task.done ? Date.now() : null;
  saveTasks();
  render();
}

function removeTask(id) {
  const item = document.querySelector(`[data-id="${id}"]`);
  if (item) {
    item.classList.add('removing');
    setTimeout(() => {
      tasks = tasks.filter(t => t.id !== id);
      saveTasks();
      render();
    }, 230);
  }
}

function clearCompleted() {
  const items = document.querySelectorAll('.task-item.completed');
  items.forEach(el => el.classList.add('removing'));
  setTimeout(() => {
    tasks = tasks.filter(t => !t.done);
    saveTasks();
    render();
  }, 250);
}

function switchTab(tab) {
  currentTab = tab;
  document.getElementById('tabActive').classList.toggle('active', tab === 'active');
  document.getElementById('tabCompleted').classList.toggle('active', tab === 'completed');
  render();
}

// ── INIT ──────────────────────────────────────────────────

loadTasks(() => {
  render();
  document.getElementById('taskInput').focus();

  // Tab switching
  document.getElementById('tabActive').addEventListener('click', () => switchTab('active'));
  document.getElementById('tabCompleted').addEventListener('click', () => switchTab('completed'));

  // Add task button
  document.getElementById('addBtn').addEventListener('click', addTask);

  // Clear completed button
  document.getElementById('clearBtn').addEventListener('click', clearCompleted);

  // Event delegation for task list (toggle + delete)
  document.getElementById('tasksList').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const item = btn.closest('.task-item');
    if (!item) return;
    const id = item.dataset.id;
    if (btn.dataset.action === 'toggle') toggleTask(id);
    else if (btn.dataset.action === 'delete') removeTask(id);
  });

  // Keyboard shortcuts
  document.getElementById('taskInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTask();
    if (e.key === 'Escape') {
      e.target.value = '';
      e.target.blur();
    }
  });
});

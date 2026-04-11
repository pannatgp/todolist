/* ═══════════════════════════════════════════════════════════
   Todo App — frontend logic
   ═══════════════════════════════════════════════════════════ */

const API = '/api/tasks';

// ── In-memory task cache ─────────────────────────────────────
let tasks = [];

// ── Filter state ──────────────────────────────────────────────
let currentFilter = 'all'; // 'all' | 'active' | 'completed'

// ── Themes ───────────────────────────────────────────────────
// Add more themes here — each needs bodyClass, decos, and emptyMsg.
const THEMES = {
  christmas: {
    label:    '🎄 Christmas',
    bodyClass: 'theme-christmas',
    emptyMsg: 'No tasks yet — add one above! 🎄',
    decos: {
      topLeft:     '📌',
      topRight:    '🎄',
      bottomLeft:  '🎅',
      bottomRight: '🎁',
    },
  },
  songkran: {
    label:    '🎉 Songkran',
    bodyClass: 'theme-songkran',
    emptyMsg: 'No tasks yet — add one above! 💦',
    decos: {
      topLeft:     '💦',
      topRight:    '🔫',
      bottomLeft:  '🐘',
      bottomRight: '🌺',
    },
  },
};

let currentTheme = localStorage.getItem('todo-theme') || 'christmas';

// ── Apply theme ───────────────────────────────────────────────
// animate=false on initial load (no flash); animate=true on switch.
function applyTheme(id, animate) {
  const theme = THEMES[id];
  if (!theme) return;

  function doApply() {
    // Swap body class
    document.body.className = theme.bodyClass;

    // Update decorative emojis
    document.getElementById('decoTopLeft').textContent     = theme.decos.topLeft;
    document.getElementById('decoTopRight').textContent    = theme.decos.topRight;
    document.getElementById('decoBottomLeft').textContent  = theme.decos.bottomLeft;
    document.getElementById('decoBottomRight').textContent = theme.decos.bottomRight;

    // Highlight active option in dropdown
    document.querySelectorAll('.theme-option').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === id);
    });

    currentTheme = id;
    localStorage.setItem('todo-theme', id);
    render(); // refresh empty-state message
  }

  if (animate) {
    // Quick opacity crossfade so color/font changes are invisible during swap
    const body = document.body;
    body.style.transition = 'opacity 0.15s ease';
    body.style.opacity    = '0';
    setTimeout(() => {
      doApply();
      body.style.opacity = '1';
      setTimeout(() => {
        body.style.removeProperty('opacity');
        body.style.removeProperty('transition');
      }, 300);
    }, 160);
  } else {
    doApply();
  }
}

// ── Theme dropdown ────────────────────────────────────────────
function selectTheme(id) {
  closeThemeDropdown();
  if (id !== currentTheme) applyTheme(id, true);
}

function toggleThemeDropdown() {
  document.getElementById('themeDropdown').classList.toggle('open');
}

function closeThemeDropdown() {
  document.getElementById('themeDropdown').classList.remove('open');
}

// Close dropdown when clicking anywhere outside the switcher
document.addEventListener('click', e => {
  if (!document.getElementById('themeSwitcher').contains(e.target)) {
    closeThemeDropdown();
  }
});

// ── Month subtitle ────────────────────────────────────────────
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

(function setSubtitle() {
  const d = new Date();
  document.getElementById('subtitle').textContent =
    MONTHS[d.getMonth()] + ' ' + d.getFullYear();
})();

// ── Enter key on input ────────────────────────────────────────
document.getElementById('taskInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') addTask();
});

// ── Helpers ───────────────────────────────────────────────────
function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Error toast ───────────────────────────────────────────────
function showError(msg) {
  const toast = document.getElementById('errorToast');
  toast.textContent = msg;
  toast.classList.add('visible');
  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => toast.classList.remove('visible'), 4500);
}

// ── Loading state ─────────────────────────────────────────────
function setLoading(on) {
  document.getElementById('spinnerWrap').style.display = on ? 'flex'  : 'none';
  document.getElementById('tasksGrid').style.display   = on ? 'none'  : 'grid';
  document.querySelector('.task-meta').style.display   = on ? 'none'  : 'flex';
}

// ── Filter tabs ────────────────────────────────────────────────
function setFilter(filter) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
  render();
}

// ── Render ────────────────────────────────────────────────────
function render() {
  const grid     = document.getElementById('tasksGrid');
  const counter  = document.getElementById('taskCounter');
  const clearBtn = document.getElementById('clearCompleted');

  const total     = tasks.length;
  const doneCount = tasks.filter(t => t.completed).length;
  const remaining = total - doneCount;

  // Counter + clear button
  counter.textContent    = total ? `${remaining} remaining · ${doneCount} done` : '';
  clearBtn.style.display = doneCount > 0 ? 'inline-block' : 'none';

  // Apply filter
  const filtered = currentFilter === 'all'
    ? tasks
    : tasks.filter(t => currentFilter === 'active' ? !t.completed : t.completed);

  // Task list
  if (total === 0) {
    const msg = THEMES[currentTheme]?.emptyMsg ?? 'No tasks yet — add one above!';
    grid.innerHTML = `<div class="empty-state">${msg}</div>`;
    return;
  }

  if (filtered.length === 0) {
    const filterLabel = currentFilter === 'active' ? 'active' : 'completed';
    grid.innerHTML = `<div class="empty-state">No ${filterLabel} tasks</div>`;
    return;
  }

  grid.innerHTML = filtered.map(t => `
    <div class="task-item" data-id="${t.id}">
      <div class="task-check${t.completed ? ' checked' : ''}"
           onclick="toggleTask(${t.id})"
           title="${t.completed ? 'Mark incomplete' : 'Mark complete'}"
           role="checkbox"
           aria-checked="${!!t.completed}"></div>
      <div class="task-body">
        <div class="task-text${t.completed ? ' done' : ''}">${escHtml(t.text)}</div>
        <div class="task-ts">${escHtml(t.created_at)}</div>
      </div>
      <button class="delete-btn"
              onclick="deleteTask(${t.id})"
              title="Remove task"
              aria-label="Delete task">✕</button>
    </div>
  `).join('');
}

// ── Fetch all tasks (initial load) ────────────────────────────
async function fetchTasks() {
  setLoading(true);
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error(`Server responded ${res.status}`);
    tasks = await res.json();
    render();
  } catch (err) {
    console.error('[fetchTasks]', err);
    showError('Could not load tasks. Is the server running?');
    tasks = [];
    render();
  } finally {
    setLoading(false);
  }
}

// ── Add task ──────────────────────────────────────────────────
async function addTask() {
  const input  = document.getElementById('taskInput');
  const addBtn = document.getElementById('addBtn');
  const text   = input.value.trim();
  if (!text) { input.focus(); return; }

  addBtn.disabled = true;
  try {
    const res = await fetch(API, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ text }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Server responded ${res.status}`);
    }
    const task = await res.json();
    tasks.push(task);
    input.value = '';
    input.focus();
    render();
  } catch (err) {
    console.error('[addTask]', err);
    showError('Could not add task — ' + err.message);
  } finally {
    addBtn.disabled = false;
  }
}

// ── Toggle task ───────────────────────────────────────────────
async function toggleTask(id) {
  try {
    const res = await fetch(`${API}/${id}`, { method: 'PATCH' });
    if (!res.ok) throw new Error(`Server responded ${res.status}`);
    const updated = await res.json();
    const idx = tasks.findIndex(t => t.id === id);
    if (idx !== -1) tasks[idx] = updated;
    render();
  } catch (err) {
    console.error('[toggleTask]', err);
    showError('Could not update task. Please try again.');
  }
}

// ── Delete single task ────────────────────────────────────────
async function deleteTask(id) {
  try {
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Server responded ${res.status}`);
    tasks = tasks.filter(t => t.id !== id);
    render();
  } catch (err) {
    console.error('[deleteTask]', err);
    showError('Could not delete task. Please try again.');
  }
}

// ── Clear all completed ───────────────────────────────────────
async function clearCompleted() {
  if (!tasks.some(t => t.completed)) return;
  try {
    const res = await fetch(`${API}/completed`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Server responded ${res.status}`);
    tasks = tasks.filter(t => !t.completed);
    render();
  } catch (err) {
    console.error('[clearCompleted]', err);
    showError('Could not clear completed tasks. Please try again.');
  }
}

// ── Bootstrap ─────────────────────────────────────────────────
applyTheme(currentTheme, false); // restore saved theme before first paint
fetchTasks();

/* ═══════════════════════════════════════════════════════════
   Christmas Todo App — frontend logic
   All state is authoritative on the server; the local `tasks`
   array is a cache that is kept in sync after each API call.
   ═══════════════════════════════════════════════════════════ */

const API = '/api/tasks';

// ── In-memory cache ──────────────────────────────────────────
let tasks = [];

// ── Month subtitle ───────────────────────────────────────────
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

(function setSubtitle() {
  const d = new Date();
  document.getElementById('subtitle').textContent =
    MONTHS[d.getMonth()] + ' ' + d.getFullYear();
})();

// ── Enter key on input ───────────────────────────────────────
document.getElementById('taskInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') addTask();
});

// ── Helpers ──────────────────────────────────────────────────
function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Error toast ──────────────────────────────────────────────
function showError(msg) {
  const toast = document.getElementById('errorToast');
  toast.textContent = msg;
  toast.classList.add('visible');
  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => toast.classList.remove('visible'), 4500);
}

// ── Loading state ─────────────────────────────────────────────
function setLoading(on) {
  const spinner = document.getElementById('spinnerWrap');
  const grid    = document.getElementById('tasksGrid');
  const meta    = document.querySelector('.task-meta');
  spinner.style.display = on ? 'flex'   : 'none';
  grid.style.display    = on ? 'none'   : 'grid';
  meta.style.display    = on ? 'none'   : 'flex';
}

// ── Render ────────────────────────────────────────────────────
function render() {
  const grid      = document.getElementById('tasksGrid');
  const counter   = document.getElementById('taskCounter');
  const clearBtn  = document.getElementById('clearCompleted');

  const total     = tasks.length;
  const doneCount = tasks.filter(t => t.completed).length;
  const remaining = total - doneCount;

  // Counter + clear button visibility
  if (total === 0) {
    counter.textContent  = '';
    clearBtn.style.display = 'none';
  } else {
    counter.textContent    = `${remaining} remaining · ${doneCount} done`;
    clearBtn.style.display = doneCount > 0 ? 'inline-block' : 'none';
  }

  // Task list
  if (total === 0) {
    grid.innerHTML = '<div class="empty-state">No tasks yet — add one above! 🎄</div>';
    return;
  }

  grid.innerHTML = tasks.map(t => `
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

// ── Add task ─────────────────────────────────────────────────
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
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Server responded ${res.status}`);
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

// ── Clear all completed tasks ─────────────────────────────────
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
fetchTasks();

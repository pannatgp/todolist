const express = require('express');
const path    = require('path');
const db      = require('./db/database');

const app  = express();
const PORT = process.env.PORT || 3000;


// ── Middleware ──────────────────────────────────────────────
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ── Helpers ─────────────────────────────────────────────────
function formatTs(date) {
  const p = n => String(n).padStart(2, '0');
  return `${p(date.getDate())}/${p(date.getMonth() + 1)}/${date.getFullYear()}, ${p(date.getHours())}:${p(date.getMinutes())}`;
}

// ── GET /api/tasks ───────────────────────────────────────────
// Returns all tasks ordered by insertion time (oldest first).
app.get('/api/tasks', (req, res) => {
  try {
    const tasks = db.prepare('SELECT * FROM tasks ORDER BY id ASC').all();
    res.json(tasks);
  } catch (err) {
    console.error('[GET /api/tasks]', err.message);
    res.status(500).json({ error: 'Failed to fetch tasks.' });
  }
});

// ── POST /api/tasks ──────────────────────────────────────────
// Body: { text: string }
// Returns the newly created task object.
app.post('/api/tasks', (req, res) => {
  const text = (req.body.text || '').trim();
  if (!text) {
    return res.status(400).json({ error: 'Task text is required.' });
  }
  try {
    const created_at = formatTs(new Date());
    const { lastInsertRowid } = db
      .prepare('INSERT INTO tasks (text, completed, created_at) VALUES (?, 0, ?)')
      .run(text, created_at);
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(lastInsertRowid);
    res.status(201).json(task);
  } catch (err) {
    console.error('[POST /api/tasks]', err.message);
    res.status(500).json({ error: 'Failed to create task.' });
  }
});

// ── PATCH /api/tasks/:id ─────────────────────────────────────
// Toggles the completed status of a task.
// Returns the updated task object.
app.patch('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid task ID.' });
  try {
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!task) return res.status(404).json({ error: 'Task not found.' });

    db.prepare('UPDATE tasks SET completed = ? WHERE id = ?')
      .run(task.completed ? 0 : 1, id);
    const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    res.json(updated);
  } catch (err) {
    console.error('[PATCH /api/tasks/:id]', err.message);
    res.status(500).json({ error: 'Failed to update task.' });
  }
});

// ── DELETE /api/tasks/completed ──────────────────────────────
// Deletes all completed tasks. MUST be registered before /:id.
// Returns { deleted: <count> }.
app.delete('/api/tasks/completed', (req, res) => {
  try {
    const { changes } = db.prepare('DELETE FROM tasks WHERE completed = 1').run();
    res.json({ deleted: changes });
  } catch (err) {
    console.error('[DELETE /api/tasks/completed]', err.message);
    res.status(500).json({ error: 'Failed to clear completed tasks.' });
  }
});

// ── DELETE /api/tasks/:id ────────────────────────────────────
// Deletes a single task by ID.
// Returns { deleted: true }.
app.delete('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid task ID.' });
  try {
    const { changes } = db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    if (changes === 0) return res.status(404).json({ error: 'Task not found.' });
    res.json({ deleted: true });
  } catch (err) {
    console.error('[DELETE /api/tasks/:id]', err.message);
    res.status(500).json({ error: 'Failed to delete task.' });
  }
});

// ── Fallback: serve SPA index ────────────────────────────────
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// ── Start ────────────────────────────────────────────────────
// #region agent log
fetch('http://127.0.0.1:7334/ingest/8dc03aa6-de26-4457-afd2-894c68c40c39',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'2e3c95'},body:JSON.stringify({sessionId:'2e3c95',runId:'server-listen',hypothesisId:'H1-H3',location:'server.js:listen',message:'binding listen attempt',data:{port:Number(PORT),envPort:process.env.PORT||null},timestamp:Date.now()})}).catch(()=>{});
// #endregion
const server = app.listen(PORT, '0.0.0.0', () => {
  // #region agent log
  fetch('http://127.0.0.1:7334/ingest/8dc03aa6-de26-4457-afd2-894c68c40c39',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'2e3c95'},body:JSON.stringify({sessionId:'2e3c95',runId:'server-listen',hypothesisId:'H1',location:'server.js:listen:callback',message:'listen succeeded',data:{port:Number(PORT)},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
  console.log(`✅  Server running at http://localhost:${PORT}`);
  console.log(`    Press Ctrl+C to stop.`);
});

server.on('error', (err) => {
  // #region agent log
  fetch('http://127.0.0.1:7334/ingest/8dc03aa6-de26-4457-afd2-894c68c40c39',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'2e3c95'},body:JSON.stringify({sessionId:'2e3c95',runId:'server-listen',hypothesisId:'H1-H2',location:'server.js:server.on(error)',message:err.code||err.message,data:{code:err.code,port:Number(PORT)},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Stop the other process or run: PORT=3001 npm start`);
    process.exit(1);
  }
  throw err;
});

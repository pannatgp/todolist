# 🎄 Christmas Todo App

A Christmas/holiday-themed to-do list web app with a Thai-style notebook paper design. Tasks are persisted in a SQLite database served by a lightweight Node.js/Express backend.

---

## Screenshot

> _Add a screenshot here after running the app_
> `frontend/assets/screenshot.png`

---

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Runtime  | Node.js v18+                        |
| Server   | Express 4                           |
| Database | SQLite via `better-sqlite3`         |
| Frontend | Vanilla HTML · CSS · JavaScript     |
| Fonts    | Google Fonts — Sacramento · Itim    |

---

## Prerequisites

- **Node.js v18 or later** — [nodejs.org](https://nodejs.org)

---

## Installation & Running

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd todo-app

# 2. Install backend dependencies
cd backend
npm install

# 3. Start the server
npm start
```

Then open **http://localhost:3000** in your browser.

> The SQLite database (`backend/db/tasks.db`) is created automatically on first run.

### Development mode (auto-restart on file changes)

```bash
cd backend
npm run dev
```

---

## API Documentation

All endpoints are prefixed with `/api`.

| Method   | Path                    | Request Body        | Response                          | Description                     |
|----------|-------------------------|---------------------|-----------------------------------|---------------------------------|
| `GET`    | `/api/tasks`            | —                   | `Task[]`                          | Fetch all tasks (oldest first)  |
| `POST`   | `/api/tasks`            | `{ "text": "..." }` | `Task`                            | Create a new task               |
| `PATCH`  | `/api/tasks/:id`        | —                   | `Task`                            | Toggle completed status         |
| `DELETE` | `/api/tasks/:id`        | —                   | `{ "deleted": true }`            | Delete a single task            |
| `DELETE` | `/api/tasks/completed`  | —                   | `{ "deleted": <count> }`         | Delete all completed tasks      |

### Task object schema

```json
{
  "id":         1,
  "text":       "Buy wrapping paper",
  "completed":  0,
  "created_at": "10/04/2026, 14:35"
}
```

> `completed` is stored as an integer (`0` = false, `1` = true) per SQLite convention.

---

## Folder Structure

```
todo-app/
├── README.md
├── .gitignore
├── backend/
│   ├── package.json          # Node dependencies & scripts
│   ├── server.js             # Express app & REST routes
│   └── db/
│       ├── database.js       # SQLite connection & schema init
│       └── tasks.db          # Auto-generated database file
└── frontend/
    ├── index.html            # App shell (migrated from todo.html)
    ├── css/
    │   └── style.css         # All styles — Christmas theme
    ├── js/
    │   └── app.js            # API calls, render, state
    └── assets/               # Images / icons (if any)
```

---

## Features

- **Add tasks** — type and press Enter or click Add
- **Toggle complete** — circular checkbox with strikethrough + fade
- **Delete task** — hover a task to reveal the ✕ button
- **Clear completed** — one-click bulk delete of done tasks
- **Task counter** — "X remaining · Y done" live count
- **Timestamps** — each task shows when it was added (`DD/MM/YYYY, HH:MM`)
- **Loading spinner** — shown while tasks are fetching on page load
- **Error toasts** — friendly messages if the API is unreachable
- **Responsive** — 2-column grid collapses to 1 column on small screens
- **Thai language support** — Itim font covers Thai script

---

## Future Improvements

- **Authentication** — user accounts so each person has their own list
- **Drag-and-drop reorder** — rearrange tasks with the Drag and Drop API
- **Categories / tags** — group tasks by colour-coded labels
- **Dark mode** — CSS custom properties + `prefers-color-scheme` toggle
- **Due dates** — add optional deadlines with overdue highlighting
- **Search / filter** — filter by status (all · active · completed)
- **Offline support** — service worker + IndexedDB for PWA behaviour
- **Recurring tasks** — mark tasks as daily/weekly so they reset automatically

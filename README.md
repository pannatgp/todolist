# 🎄🎉 Todo App — Multi-Theme

A to-do list web app with swappable themes — currently featuring a **Christmas** holiday theme and a **Thai Songkran** water festival theme. Built with a notebook-paper card design, Thai language support, and a lightweight Node.js/Express + SQLite backend.

---

## Screenshot

> _Add a screenshot here after running the app_
> `frontend/assets/screenshot.png`

---

## Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Runtime  | Node.js v18+                            |
| Server   | Express 4                               |
| Database | SQLite via `better-sqlite3`             |
| Frontend | Vanilla HTML · CSS · JavaScript         |
| Fonts    | Google Fonts — Sacramento · Itim · Prompt |

---

## Prerequisites

- **Node.js v18 or later** — [nodejs.org](https://nodejs.org)

---

## Installation & Running

```bash
# 1. Clone the repo
git clone https://github.com/pannatgp/todolist.git
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
.
├── .cursor/               # IDE configuration files
├── todo-app/              # Main application directory
│   ├── backend/           # Node.js + Express server
│   │   ├── db/            # SQLite database files (tasks.db)
│   │   ├── node_modules/  # Backend dependencies
│   │   ├── scripts/       # Utility and build scripts
│   │   ├── package.json   # Backend scripts and dependencies
│   │   └── server.js      # Entry point for the API
│   └── frontend/          # Client-side web app
│       ├── assets/        # Images and static media
│       ├── css/           # Stylesheets (Christmas & Songkran themes)
│       ├── js/            # Frontend logic (app.js)
│       └── index.html     # Main user interface
├── .gitignore             # Files to exclude from Git
├── README.md              # Project documentation (this file)
└── todo.html              # Legacy or backup HTML template

---

## Features

- **Theme Switcher** — floating 🎨 button with dropdown to swap between themes
- **🎄 Christmas Theme** — teal green background, cream notebook card, red accents, festive emojis (📌🎄🎅)
- **🎉 Songkran Theme** — blue water gradient background, white card with wave border, orange accents, water festival emojis (💦🔫🐘🌺)
- **Theme Persistence** — selected theme saves to localStorage and persists on refresh
- **Smooth Transitions** — colors crossfade smoothly when switching themes
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
- **More themes** — easily add new themes like Loy Krathong, Halloween, or Valentine's Day using the CSS variable system
- **Due dates** — add optional deadlines with overdue highlighting
- **Search / filter** — filter by status (all · active · completed)
- **Offline support** — service worker + IndexedDB for PWA behaviour
- **Recurring tasks** — mark tasks as daily/weekly so they reset automatically
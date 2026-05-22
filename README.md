# Task Manager

Full-stack task management app with auth, CRUD, real-time WebSocket updates, and responsive UI.

## Stack
- Backend: Node.js + Express + WebSockets (ws)
- Frontend: React + Vite

## Quick Start

```bash
# Backend
cd backend
npm install
npm run dev   # runs on :4000

# Frontend (new terminal)
cd frontend
npm install
npm run dev   # runs on :5173
```

Open http://localhost:5173, register an account, and start managing tasks.

## Features
- Register / Login with JWT auth
- Create, update status, delete tasks
- Priority levels (low / medium / high)
- Filter by status
- Real-time updates via WebSocket
- Responsive for mobile & desktop

import React, { useState, useEffect, useCallback } from 'react';
import Auth from './Auth';
import { getTasks, createTask, updateTask, deleteTask } from './api';
import useWebSocket from './useWebSocket';

const STATUSES = ['all', 'todo', 'inprogress', 'done'];
const PRIORITIES = ['low', 'medium', 'high'];

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [username, setUsername] = useState(() => localStorage.getItem('username') || '');
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium' });

  const handleWsMessage = useCallback((msg) => {
    if (msg.type === 'TASK_CREATED') setTasks(t => [...t, msg.task]);
    if (msg.type === 'TASK_UPDATED') setTasks(t => t.map(x => x.id === msg.task.id ? msg.task : x));
    if (msg.type === 'TASK_DELETED') setTasks(t => t.filter(x => x.id !== msg.id));
  }, []);

  const wsConnected = useWebSocket(handleWsMessage);

  useEffect(() => {
    if (!token) return;
    getTasks(token).then(data => Array.isArray(data) && setTasks(data));
  }, [token]);

  const handleAuth = (tok, user) => {
    localStorage.setItem('token', tok);
    localStorage.setItem('username', user);
    setToken(tok); setUsername(user);
  };

  const logout = () => {
    localStorage.clear(); setToken(''); setUsername(''); setTasks([]);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    await createTask(token, { ...form, status: 'todo' });
    setForm({ title: '', description: '', priority: 'medium' });
  };

  const changeStatus = async (task, status) => {
    await updateTask(token, task.id, { status });
  };

  const remove = async (id) => {
    await deleteTask(token, id);
  };

  if (!token) return <Auth onAuth={handleAuth} />;

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);

  return (
    <div className="container">
      <header>
        <h1>📋 Task Manager</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.85rem', color: '#666' }}>
            <span className={`ws-dot ${wsConnected ? 'connected' : 'disconnected'}`} />
            {username}
          </span>
          <button className="btn btn-danger" onClick={logout}>Logout</button>
        </div>
      </header>

      <div className="task-form">
        <h2>New Task</h2>
        <form onSubmit={submit}>
          <div className="form-row" style={{ marginBottom: '0.75rem' }}>
            <input
              placeholder="Task title *"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              required
            />
            <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
              {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)} Priority</option>)}
            </select>
          </div>
          <div className="form-row">
            <textarea
              placeholder="Description (optional)"
              rows={2}
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
            <button className="btn btn-primary" type="submit" style={{ alignSelf: 'flex-end', width: 'auto' }}>
              + Add Task
            </button>
          </div>
        </form>
      </div>

      <div className="filters">
        {STATUSES.map(s => (
          <button
            key={s}
            className={`filter-btn ${filter === s ? 'active' : ''}`}
            onClick={() => setFilter(s)}
          >
            {s === 'all' ? `All (${tasks.length})` : s === 'inprogress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
            {s !== 'all' && ` (${tasks.filter(t => t.status === s).length})`}
          </button>
        ))}
      </div>

      <div className="task-list">
        {filtered.length === 0 && <p className="empty">No tasks here. Add one above.</p>}
        {filtered.map(task => (
          <div key={task.id} className={`task-card ${task.status === 'done' ? 'done' : ''}`}>
            <div className="task-info">
              <p className="task-title">{task.title}</p>
              {task.description && <p className="task-desc">{task.description}</p>}
              <div className="task-meta">
                <span className={`badge badge-${task.status}`}>
                  {task.status === 'inprogress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </span>
                <span className={`badge badge-${task.priority}`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
              </div>
            </div>
            <div className="task-actions">
              <select value={task.status} onChange={e => changeStatus(task, e.target.value)}>
                <option value="todo">Todo</option>
                <option value="inprogress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <button className="btn btn-danger" onClick={() => remove(task.id)}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

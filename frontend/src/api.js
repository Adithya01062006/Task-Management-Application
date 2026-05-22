const BASE = '/api';

const headers = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {})
});

export const register = (username, password) =>
  fetch(`${BASE}/auth/register`, { method: 'POST', headers: headers(), body: JSON.stringify({ username, password }) }).then(r => r.json());

export const login = (username, password) =>
  fetch(`${BASE}/auth/login`, { method: 'POST', headers: headers(), body: JSON.stringify({ username, password }) }).then(r => r.json());

export const getTasks = (token) =>
  fetch(`${BASE}/tasks`, { headers: headers(token) }).then(r => r.json());

export const createTask = (token, data) =>
  fetch(`${BASE}/tasks`, { method: 'POST', headers: headers(token), body: JSON.stringify(data) }).then(r => r.json());

export const updateTask = (token, id, data) =>
  fetch(`${BASE}/tasks/${id}`, { method: 'PUT', headers: headers(token), body: JSON.stringify(data) }).then(r => r.json());

export const deleteTask = (token, id) =>
  fetch(`${BASE}/tasks/${id}`, { method: 'DELETE', headers: headers(token) }).then(r => r.json());

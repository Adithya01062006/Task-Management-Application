import React, { useState } from 'react';
import { login, register } from './api';

export default function Auth({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    const fn = mode === 'login' ? login : register;
    const res = await fn(username, password);
    if (res.error) return setError(res.error);
    onAuth(res.token, res.username);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1>📋 Task Manager</h1>
        <form onSubmit={submit}>
          {error && <p className="error">{error}</p>}
          <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button className="btn btn-primary" type="submit">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        <p className="auth-switch">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button className="btn btn-ghost" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? 'Register' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}

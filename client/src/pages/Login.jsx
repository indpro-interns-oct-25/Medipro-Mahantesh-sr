import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth.js';

export default function Login({ onLoggedIn }) {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    try {
      await login(email, password);
      onLoggedIn?.();
      if (window.showNotification) {
        window.showNotification('Login successful!', 'success');
      }
      navigate('/');
    } catch (e) {
      const errorMsg = e.message || 'Login failed. Please check your credentials.';
      setError(errorMsg);
      if (window.showNotification) {
        window.showNotification(errorMsg, 'error');
      }
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow">
      <h2 className="mb-4 text-2xl font-semibold">Login</h2>
      <form onSubmit={submit} className="grid gap-3">
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}



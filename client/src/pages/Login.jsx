import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../lib/api';
import { useAuth } from '../App';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fn = isRegister ? register : login;
      const res = await fn(form);
      setUser(res.data.user);
      navigate('/');
    } catch (err) {
      alert('Authentication failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm p-6 rounded-xl bg-[var(--card)] border border-[var(--border)] space-y-4">
        <h1 className="text-xl font-bold text-center">{isRegister ? 'Register' : 'Login'}</h1>
        {isRegister && (
          <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full p-2 rounded bg-[var(--bg)] border border-[var(--border)]" required />
        )}
        <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full p-2 rounded bg-[var(--bg)] border border-[var(--border)]" required />
        <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full p-2 rounded bg-[var(--bg)] border border-[var(--border)]" required />
        <button type="submit" className="w-full py-2 bg-primary rounded-lg font-semibold">{isRegister ? 'Register' : 'Login'}</button>
        <p className="text-sm text-center text-gray-400">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <button type="button" onClick={() => setIsRegister(!isRegister)} className="text-primary ml-1">{isRegister ? 'Login' : 'Register'}</button>
        </p>
      </form>
    </div>
  );
}

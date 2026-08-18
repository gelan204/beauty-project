import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from './store.js';
import { Button, SoftCard } from '@elaris/shared-ui';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: 'owner@maisonmuse.co', password: 'owner123' });

  const submit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    const res = await dispatch(login(form));
    if (login.fulfilled.match(res)) navigate('/');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f4ee] px-5">
      <SoftCard className="w-full max-w-md p-8">
        <p className="text-xs font-bold uppercase tracking-widest text-[#a16e45]">Salon owner</p>
        <h1 className="serif mt-3 text-3xl">Sign in to your workspace</h1>
        <form className="mt-6 grid gap-4" onSubmit={submit}>
          <input className="rounded-xl border border-[#ded3c7] px-4 py-3" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="rounded-xl border border-[#ded3c7] px-4 py-3" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          {error ? <p className="text-sm text-[#a45345]">{error}</p> : null}
          <Button type="submit">Sign in</Button>
        </form>
        <p className="mt-6 text-sm">
          <Link to="/register" className="text-[#a16e45] font-semibold">Register your salon</Link>
        </p>
      </SoftCard>
    </div>
  );
}

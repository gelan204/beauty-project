import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../features/auth/authSlice.js';
import { Button, SoftCard } from '@elaris/shared-ui';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(login(form));
    if (login.fulfilled.match(result)) {
      const redirect = params.get('redirect') || '/dashboard';
      navigate(redirect);
    }
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-5 py-12 lg:grid-cols-2 rise">
      <div className="rounded-[2rem] bg-[#29231f] p-8 text-white sm:p-12">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-[#dcb789]">Welcome back</p>
        <h1 className="serif mt-5 text-3xl leading-tight">Sign in to your Elaris.</h1>
        <p className="mt-6 max-w-sm leading-7 text-[#e0d4c7]">
          Manage appointments, favourites, and your beauty rituals in one place.
        </p>
      </div>
      <SoftCard className="p-8">
        <h2 className="serif text-2xl">Customer login</h2>
        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-xl border border-[#ded3c7] px-4 py-3"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-xl border border-[#ded3c7] px-4 py-3"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          {error ? <p className="text-sm text-[#a45345]">{error}</p> : null}
          <Button variant="luxury" type="submit">Sign in</Button>
        </form>
        <p className="mt-6 text-sm text-[#746a61]">
          New here? <Link to="/register" className="text-[#a16e45] font-semibold">Create account</Link>
        </p>
        <p className="mt-3 text-sm">
          <Link to="/portal" className="text-[#a16e45]">Salon owner or admin? Portal access →</Link>
        </p>
      </SoftCard>
    </div>
  );
}

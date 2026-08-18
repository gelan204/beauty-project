import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../features/auth/authSlice.js';
import { Button, SoftCard } from '@elaris/shared-ui';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(register(form));
    if (register.fulfilled.match(result)) navigate('/dashboard');
  };

  return (
    <div className="mx-auto max-w-lg px-5 py-12 rise">
      <SoftCard className="p-8">
        <h1 className="serif text-3xl">Create your Elaris account</h1>
        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          {['name', 'email', 'phone', 'password'].map((field) => (
            <input
              key={field}
              type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="w-full rounded-xl border border-[#ded3c7] px-4 py-3"
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              required={field !== 'phone'}
            />
          ))}
          {error ? <p className="text-sm text-[#a45345]">{error}</p> : null}
          <Button variant="luxury" type="submit">Create account</Button>
        </form>
        <p className="mt-6 text-sm">
          Already have an account? <Link to="/login" className="text-[#a16e45] font-semibold">Sign in</Link>
        </p>
      </SoftCard>
    </div>
  );
}

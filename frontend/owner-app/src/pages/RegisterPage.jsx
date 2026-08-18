import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, Button, SoftCard } from '@elaris/shared-ui';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { ...form, role: 'owner' });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f4ee] px-5">
      <SoftCard className="w-full max-w-md p-8">
        <h1 className="serif text-3xl">Register your salon</h1>
        <form className="mt-6 grid gap-4" onSubmit={submit}>
          {['name', 'email', 'phone', 'password'].map((field) => (
            <input
              key={field}
              type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="rounded-xl border border-[#ded3c7] px-4 py-3"
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              required={field !== 'phone'}
            />
          ))}
          {error ? <p className="text-sm text-[#a45345]">{error}</p> : null}
          <Button type="submit">Create owner account</Button>
        </form>
        <p className="mt-6 text-sm"><Link to="/login" className="text-[#a16e45]">Already have an account?</Link></p>
      </SoftCard>
    </div>
  );
}

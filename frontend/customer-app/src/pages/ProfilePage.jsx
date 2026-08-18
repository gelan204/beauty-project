import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { api, Button, SoftCard, Toast } from '@elaris/shared-ui';

export default function ProfilePage() {
  const { user } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [toast, setToast] = useState({ show: false, message: '' });

  useEffect(() => {
    if (user) setForm({ name: user.name || '', phone: user.phone || '' });
  }, [user]);

  const save = async (e) => {
    e.preventDefault();
    await api.patch('/users/me', form);
    setToast({ show: true, message: 'Profile updated.' });
  };

  return (
    <div className="mx-auto max-w-lg px-5 py-12 rise">
      <SoftCard className="p-8">
        <h1 className="serif text-3xl">Your profile</h1>
        <form className="mt-6 grid gap-4" onSubmit={save}>
          <input className="rounded-xl border border-[#ded3c7] px-4 py-3" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" />
          <input className="rounded-xl border border-[#ded3c7] px-4 py-3" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" />
          <input className="rounded-xl border border-[#ded3c7] bg-[#f5f0ea] px-4 py-3" value={user?.email || ''} disabled />
          <Button variant="luxury" type="submit">Save profile</Button>
        </form>
      </SoftCard>
      <Toast message={toast.message} show={toast.show} onHide={() => setToast({ show: false, message: '' })} />
    </div>
  );
}

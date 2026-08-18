import { useEffect, useState } from 'react';
import { api, Button, SoftCard, Toast } from '@elaris/shared-ui';

export default function ProfilePage() {
  const [form, setForm] = useState({ name: '', phone: '', instagram: '', openingHours: '' });
  const [toast, setToast] = useState({ show: false, message: '' });

  useEffect(() => {
    api.get('/salons/mine').then(({ data }) => {
      const s = data.data.salon;
      setForm({
        name: s.name,
        phone: s.phone,
        instagram: s.instagram,
        openingHours: 'Mon–Sat · 9 AM–8 PM',
      });
    });
  }, []);

  const save = async (e) => {
    e.preventDefault();
    await api.patch('/salons/mine', form);
    setToast({ show: true, message: 'Business profile saved.' });
  };

  return (
    <>
      <h1 className="serif text-3xl">Business profile</h1>
      <SoftCard className="mt-6 p-6">
        <form className="grid gap-5 md:grid-cols-2" onSubmit={save}>
          <div>
            <label className="mb-2 block text-sm font-semibold">Salon name</label>
            <input className="w-full rounded-xl border border-[#ded3c7] bg-white px-4 py-3" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold">Contact phone</label>
            <input className="w-full rounded-xl border border-[#ded3c7] bg-white px-4 py-3" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold">Instagram</label>
            <input className="w-full rounded-xl border border-[#ded3c7] bg-white px-4 py-3" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} />
          </div>
          <Button type="submit" className="md:col-span-2">Save business profile</Button>
        </form>
      </SoftCard>
      <Toast message={toast.message} show={toast.show} onHide={() => setToast({ show: false, message: '' })} />
    </>
  );
}

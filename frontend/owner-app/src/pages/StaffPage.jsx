import { useEffect, useState } from 'react';
import { api, Button, SoftCard, Toast, LoadingState } from '@elaris/shared-ui';

export default function StaffPage() {
  const [staff, setStaff] = useState([]);
  const [salonId, setSalonId] = useState('');
  const [form, setForm] = useState({ name: '', specialization: '', email: '', password: 'staff123' });
  const [toast, setToast] = useState({ show: false, message: '' });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const salonRes = await api.get('/salons/mine');
    const id = salonRes.data.data.salon._id;
    setSalonId(id);
    const staffRes = await api.get(`/staff/salon/${id}`);
    setStaff(staffRes.data.data.staff);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const addStaff = async (e) => {
    e.preventDefault();
    await api.post('/staff', form);
    setToast({ show: true, message: 'Staff member added.' });
    setForm({ name: '', specialization: '', email: '', password: 'staff123' });
    load();
  };

  if (loading) return <LoadingState />;

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="serif text-3xl">Staff management</h1>
      </div>
      <SoftCard className="mt-6 p-6">
        <h2 className="font-semibold">Add staff member</h2>
        <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={addStaff}>
          <input className="rounded-xl border border-[#ded3c7] px-4 py-3" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="rounded-xl border border-[#ded3c7] px-4 py-3" placeholder="Specialization" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} />
          <input className="rounded-xl border border-[#ded3c7] px-4 py-3" placeholder="Login email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="rounded-xl border border-[#ded3c7] px-4 py-3" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <Button type="submit">Add staff</Button>
        </form>
      </SoftCard>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {staff.map((member) => (
          <SoftCard key={member._id} className="p-5">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-[#e7d4bf] font-semibold">{member.name.charAt(0)}</div>
            <h2 className="mt-4 font-semibold">{member.name}</h2>
            <p className="mt-1 text-sm text-[#746a61]">{member.specialization}</p>
            <p className="mt-4 text-xs text-[#437a58]">{member.status === 'away' ? 'Away' : 'Available'}</p>
          </SoftCard>
        ))}
      </div>
      <Toast message={toast.message} show={toast.show} onHide={() => setToast({ show: false, message: '' })} />
    </>
  );
}

import { useEffect, useState } from 'react';
import { api, Button, SoftCard, Toast, formatPrice, LoadingState } from '@elaris/shared-ui';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', duration: 60, category: 'Hair' });
  const [toast, setToast] = useState({ show: false, message: '' });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const salon = await api.get('/salons/mine');
    const res = await api.get(`/services/salon/${salon.data.data.salon._id}`);
    setServices(res.data.data.services);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const addService = async (e) => {
    e.preventDefault();
    await api.post('/services', { ...form, price: Number(form.price), duration: Number(form.duration) });
    setToast({ show: true, message: 'Service added.' });
    load();
  };

  if (loading) return <LoadingState />;

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="serif text-3xl">Salon services</h1>
      </div>
      <SoftCard className="mt-6 p-6">
        <form className="grid gap-3 md:grid-cols-4" onSubmit={addService}>
          <input className="rounded-xl border border-[#ded3c7] px-4 py-3" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="rounded-xl border border-[#ded3c7] px-4 py-3" placeholder="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          <input className="rounded-xl border border-[#ded3c7] px-4 py-3" placeholder="Duration (min)" type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
          <Button type="submit">Add service</Button>
        </form>
      </SoftCard>
      <SoftCard className="mt-6 divide-y divide-[#eee3d8]">
        {services.map((service) => (
          <div key={service._id} className="flex items-center justify-between p-5">
            <span>
              <b>{service.name}</b>
              <br />
              <small className="text-[#746a61]">{formatPrice(service.price)} · {service.duration} min</small>
            </span>
            <Button variant="secondary" onClick={async () => { await api.delete(`/services/${service._id}`); load(); }}>Delete</Button>
          </div>
        ))}
      </SoftCard>
      <Toast message={toast.message} show={toast.show} onHide={() => setToast({ show: false, message: '' })} />
    </>
  );
}

import { useEffect, useState } from 'react';
import { api, Button, SoftCard, Toast } from '@elaris/shared-ui';

export default function SalonsPage() {
  const [salons, setSalons] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '' });
  const load = () => api.get('/salons/admin/pending').then(({ data }) => setSalons(data.data.salons));
  useEffect(() => { load(); }, []);
  const approve = async (id) => {
    await api.patch(`/salons/admin/${id}/status`, { status: 'approved' });
    setToast({ show: true, message: 'Salon approved and notified.' });
    load();
  };
  return (
    <>
      <h1 className="serif text-3xl">Salon approval queue</h1>
      <div className="mt-6 grid gap-4">
        {salons.map((salon) => (
          <SoftCard key={salon._id} className="flex flex-wrap items-center justify-between gap-4 p-5">
            <div>
              <h2 className="font-semibold">{salon.name}</h2>
              <p className="mt-1 text-sm text-[#746a61]">{salon.location?.area} · {salon.categories?.[0]}</p>
            </div>
            <Button onClick={() => approve(salon._id)}>Approve</Button>
          </SoftCard>
        ))}
        {!salons.length ? <p className="text-[#746a61]">No pending salons.</p> : null}
      </div>
      <Toast message={toast.message} show={toast.show} onHide={() => setToast({ show: false, message: '' })} />
    </>
  );
}

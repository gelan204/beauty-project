import { useEffect, useState } from 'react';
import { api, Button, SoftCard } from '@elaris/shared-ui';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const load = () => api.get('/services/admin/all').then(({ data }) => setServices(data.data.services));
  useEffect(() => { load(); }, []);
  const toggle = async (id) => { await api.patch(`/services/admin/${id}/toggle`); load(); };
  return (
    <>
      <h1 className="serif text-3xl">Service management</h1>
      <SoftCard className="mt-6 divide-y divide-[#eee3d8]">
        {services.map((service) => (
          <div key={service._id} className="flex items-center justify-between p-5">
            <span><b>{service.name}</b><small className="ml-2 text-[#746a61]">{service.category} · {service.duration} min</small></span>
            <Button variant="secondary" onClick={() => toggle(service._id)}>{service.status === 'active' ? 'Enabled' : 'Disabled'}</Button>
          </div>
        ))}
      </SoftCard>
    </>
  );
}

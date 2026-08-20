import { useEffect, useState } from 'react';
import { api, Button, SoftCard, StatusBadge, LoadingState, formatDate, formatTime } from '@elaris/shared-ui';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const load = () => api.get('/appointments/staff').then(({ data }) => setAppointments(data.data.appointments));
  useEffect(() => { load(); }, []);
  const complete = async (id) => { await api.patch(`/appointments/${id}/status`, { status: 'completed' }); load(); };
  return (
    <>
      <h1 className="serif text-3xl">Your appointments</h1>
      <div className="mt-6 grid gap-4">
        {appointments.map((a) => (
          <SoftCard key={a._id} className="flex flex-wrap items-center justify-between gap-4 p-5">
            <div>
              <StatusBadge status={a.status} />
              <h3 className="serif mt-2 text-xl">{a.serviceId?.name}</h3>
              <p className="text-sm text-[#746a61]">{a.customerId?.name} · {formatDate(a.date)} · {formatTime(a.startTime)}</p>
              <p className="text-sm text-[#746a61]">{a.customerId?.phone}</p>
              {a.hairType ? <p className="text-sm text-[#746a61]">Hair type: {a.hairType}</p> : null}
            </div>
            {a.status === 'confirmed' ? <Button onClick={() => complete(a._id)}>Mark completed</Button> : null}
          </SoftCard>
        ))}
      </div>
    </>
  );
}

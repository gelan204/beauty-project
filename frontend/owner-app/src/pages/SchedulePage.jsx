import { useEffect, useState } from 'react';
import { api, Button, SoftCard, StatusBadge, LoadingState, formatTime } from '@elaris/shared-ui';

export default function SchedulePage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.get('/appointments/salon').then(({ data }) => setAppointments(data.data.appointments)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/appointments/${id}/status`, { status });
    load();
  };

  if (loading) return <LoadingState />;

  return (
    <>
      <h1 className="serif text-3xl">Appointment schedule</h1>
      <SoftCard className="mt-6 divide-y divide-[#eee3d8]">
        {appointments.map((appt) => (
          <div key={appt._id} className="flex flex-wrap items-center justify-between gap-3 p-5">
            <div>
              <b>{formatTime(appt.startTime)} · {appt.customerId?.name}</b>
              <p className="mt-1 text-sm text-[#746a61]">{appt.serviceId?.name} · {appt.staffId?.name}</p>
              <StatusBadge status={appt.status} />
            </div>
            <div className="flex gap-2">
              {appt.status === 'pending' ? (
                <>
                  <Button onClick={() => updateStatus(appt._id, 'confirmed')}>Confirm</Button>
                  <Button variant="secondary" onClick={() => updateStatus(appt._id, 'rejected')}>Reject</Button>
                </>
              ) : null}
              {['pending', 'confirmed'].includes(appt.status) ? (
                <Button variant="secondary" onClick={() => updateStatus(appt._id, 'cancelled')}>Cancel</Button>
              ) : null}
              {appt.status === 'confirmed' ? (
                <Button variant="secondary" onClick={() => updateStatus(appt._id, 'completed')}>Complete</Button>
              ) : null}
            </div>
          </div>
        ))}
      </SoftCard>
    </>
  );
}

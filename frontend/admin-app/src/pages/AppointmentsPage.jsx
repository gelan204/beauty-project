import { useEffect, useState } from 'react';
import { api, Button, SoftCard, StatusBadge, LoadingState, formatTime } from '@elaris/shared-ui';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('all');
  useEffect(() => { api.get('/appointments/admin/all').then(({ data }) => setAppointments(data.data.appointments)); }, []);
  const shown = filter === 'all' ? appointments : appointments.filter((a) => a.status === filter);
  return (
    <>
      <h1 className="serif text-3xl">Appointments</h1>
      <div className="mt-6 flex flex-wrap gap-2">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((s) => (
          <Button key={s} variant={filter === s ? 'primary' : 'secondary'} onClick={() => setFilter(s)}>{s}</Button>
        ))}
      </div>
      <SoftCard className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="border-b border-[#e8dfd4] text-[#746a61]">
            <tr><th className="p-4">Customer</th><th>Salon</th><th>Service</th><th>Time</th><th>Status</th></tr>
          </thead>
          <tbody>
            {shown.map((a) => (
              <tr key={a._id} className="border-b border-[#f0e8de]">
                <td className="p-4 font-semibold">{a.customerId?.name}</td>
                <td>{a.salonId?.name}</td>
                <td>{a.serviceId?.name}</td>
                <td>{formatTime(a.startTime)}</td>
                <td><StatusBadge status={a.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </SoftCard>
    </>
  );
}

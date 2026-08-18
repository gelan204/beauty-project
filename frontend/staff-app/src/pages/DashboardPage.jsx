import { useEffect, useState } from 'react';
import { api, SoftCard, StatusBadge, LoadingState, formatDate, formatTime } from '@elaris/shared-ui';

export default function DashboardPage() {
  const [appointments, setAppointments] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/appointments/staff?upcoming=true'),
      api.get('/staff/me'),
    ]).then(([appts, staff]) => {
      setAppointments(appts.data.data.appointments);
      setProfile(staff.data.data.staff);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState />;
  const today = appointments.filter((a) => new Date(a.date).toDateString() === new Date().toDateString());

  return (
    <>
      <p className="text-xs font-bold uppercase tracking-[.18em] text-[#a16e45]">Staff dashboard</p>
      <h1 className="serif mt-3 text-[2rem]">Hello, {profile?.name}.</h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <SoftCard className="p-6">
          <h2 className="serif text-xl">Today's appointments</h2>
          {today.length ? today.map((a) => (
            <div key={a._id} className="mt-4 border-t border-[#eee3d8] pt-4">
              <StatusBadge status={a.status} />
              <p className="mt-2 font-semibold">{a.serviceId?.name}</p>
              <p className="text-sm text-[#746a61]">{a.customerId?.name} · {formatTime(a.startTime)}</p>
            </div>
          )) : <p className="mt-4 text-sm text-[#746a61]">No appointments today.</p>}
        </SoftCard>
        <SoftCard className="p-6">
          <h2 className="serif text-xl">Assigned services</h2>
          <ul className="mt-4 space-y-2 text-sm text-[#746a61]">
            {(profile?.services || []).map((s) => <li key={s._id || s}>{s.name || 'Service'}</li>)}
          </ul>
        </SoftCard>
      </div>
      <SoftCard className="mt-6 p-6">
        <h2 className="serif text-xl">Upcoming</h2>
        {appointments.map((a) => (
          <p key={a._id} className="mt-3 text-sm">{formatDate(a.date)} · {formatTime(a.startTime)} · {a.customerId?.name}</p>
        ))}
      </SoftCard>
    </>
  );
}

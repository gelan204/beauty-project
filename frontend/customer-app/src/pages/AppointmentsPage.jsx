import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  api,
  Button,
  SoftCard,
  StatusBadge,
  Toast,
  formatDate,
  formatTime,
  LoadingState,
} from '@elaris/shared-ui';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [rescheduleId, setRescheduleId] = useState(null);
  const [form, setForm] = useState({ date: '', startTime: '' });

  const load = () => {
    api
      .get('/appointments/mine')
      .then(({ data }) => setAppointments(data.data.appointments))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const cancel = async (id) => {
    await api.patch(`/appointments/${id}/status`, { status: 'cancelled' });
    setToast({ show: true, message: 'Appointment cancelled.' });
    load();
  };

  const reschedule = async (e) => {
    e.preventDefault();
    await api.patch(`/appointments/${rescheduleId}/reschedule`, form);
    setToast({ show: true, message: 'Reschedule request submitted.' });
    setRescheduleId(null);
    load();
  };

  if (loading) return <LoadingState />;

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 rise">
      <Link to="/dashboard" className="text-sm text-[#a16e45]">← Dashboard</Link>
      <h1 className="serif mt-4 text-3xl">Your appointments</h1>
      <div className="mt-8 grid gap-4">
        {appointments.map((appt) => (
          <SoftCard key={appt._id} className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <StatusBadge status={appt.status} />
                <h3 className="serif mt-3 text-xl">{appt.serviceId?.name}</h3>
                <p className="mt-2 text-sm text-[#746a61]">
                  {appt.salonId?.name} · {formatDate(appt.date)} · {formatTime(appt.startTime)}
                </p>
              </div>
              {['pending', 'confirmed'].includes(appt.status) ? (
                <div className="flex gap-2">
                  <Button variant="luxury" onClick={() => setRescheduleId(appt._id)}>Reschedule</Button>
                  <button type="button" className="text-sm font-semibold text-[#a45345]" onClick={() => cancel(appt._id)}>
                    Cancel
                  </button>
                </div>
              ) : null}
            </div>
          </SoftCard>
        ))}
      </div>

      {rescheduleId ? (
        <SoftCard className="mt-8 p-6">
          <h2 className="serif text-xl">Reschedule</h2>
          <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={reschedule}>
            <input type="date" className="rounded-xl border border-[#ded3c7] px-4 py-3" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            <input type="time" className="rounded-xl border border-[#ded3c7] px-4 py-3" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} required />
            <Button variant="luxury" type="submit">Submit</Button>
          </form>
        </SoftCard>
      ) : null}

      <Toast message={toast.message} show={toast.show} onHide={() => setToast({ show: false, message: '' })} />
    </div>
  );
}

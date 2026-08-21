import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
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

export default function DashboardPage() {
  const { user } = useSelector((state) => state.auth);
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '' });

  const load = () => {
    Promise.all([
      api.get('/appointments/mine'),
      api.get('/notifications'),
    ])
      .then(([appts, notes]) => {
        setAppointments(appts.data.data.appointments);
        setNotifications(notes.data.data.notifications.slice(0, 5));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const cancelAppointment = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await api.patch(`/appointments/${id}/status`, { status: 'cancelled' });
      setToast({ show: true, message: 'Cancellation request recorded.' });
      load();
    } catch (err) {
      setToast({ show: true, message: err.response?.data?.message || 'Could not cancel.' });
    }
  };

  if (loading) return <LoadingState />;

  const upcomingStatuses = ['confirmed', 'in-progress', 'in_progress', 'in progress'];
  const upcomingCount = appointments.filter((appointment) =>
    upcomingStatuses.includes(appointment.status?.toLowerCase())
  ).length;
  const next = appointments.find((appointment) =>
    ['pending', ...upcomingStatuses].includes(appointment.status?.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 rise">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-[#a16e45]">Your Elaris</p>
          <h1 className="serif mt-3 text-[2rem]">Good morning, {user?.name?.split(' ')[0]}.</h1>
        </div>
        <Link to="/"><Button variant="luxury">Back to explore</Button></Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <SoftCard className="p-5">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#a16e45]">Upcoming</p>
          <p className="serif mt-2 text-3xl">{upcomingCount}</p>
          <p className="mt-1 text-sm text-[#746a61]">Confirmed or in progress</p>
        </SoftCard>
        <SoftCard className="p-5">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#a16e45]">Total bookings</p>
          <p className="serif mt-2 text-3xl">{appointments.length}</p>
          <p className="mt-1 text-sm text-[#746a61]">All appointments</p>
        </SoftCard>
      </div>

      <div className="mt-9 grid gap-6 lg:grid-cols-[1fr_.36fr]">
        <div>
          <h2 className="serif text-2xl">Upcoming appointments</h2>
          {next ? (
            <SoftCard className="mt-5 p-6">
              <StatusBadge status={next.status} />
              <h3 className="serif mt-4 text-2xl">{next.serviceId?.name}</h3>
              <p className="mt-2 text-sm text-[#71675e]">
                {next.salonId?.name} · {formatDate(next.date)} · {formatTime(next.startTime)}
              </p>
              <div className="mt-6 flex gap-3">
                <Link to="/appointments"><Button variant="luxury">Reschedule</Button></Link>
                <button
                  type="button"
                  className="text-sm font-semibold text-[#a45345]"
                  onClick={() => cancelAppointment(next._id)}
                >
                  Cancel appointment
                </button>
              </div>
            </SoftCard>
          ) : (
            <SoftCard className="mt-5 p-6 text-sm text-[#746a61]">
              No upcoming appointments. <Link to="/book" className="text-[#a16e45]">Book one →</Link>
            </SoftCard>
          )}
        </div>

        <SoftCard className="p-6">
          <h2 className="serif text-xl">Notifications</h2>
          {notifications.length ? (
            notifications.map((note) => (
              <p key={note._id} className="mt-5 border-b border-[#eee3d8] pb-4 text-sm last:border-0">
                <b>{note.title}</b>
                <br />
                <span className="text-[#776c62]">{note.message}</span>
              </p>
            ))
          ) : (
            <p className="mt-5 text-sm text-[#746a61]">No notifications yet.</p>
          )}
        </SoftCard>
      </div>

      <Toast message={toast.message} show={toast.show} onHide={() => setToast({ show: false, message: '' })} />
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  api,
  Button,
  SoftCard,
  Toast,
  formatDate,
  formatTime,
  LoadingState,
} from '@elaris/shared-ui';

const statusLabels = {
  confirmed: 'Confirmed',
  'in-progress': 'In Progress',
  in_progress: 'In Progress',
  'in progress': 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  pending: 'Pending',
  rejected: 'Rejected',
};

const statusClasses = {
  confirmed: 'bg-[#f7ead5] text-[#9b651c]',
  'in-progress': 'bg-[#e2eef8] text-[#356a96]',
  in_progress: 'bg-[#e2eef8] text-[#356a96]',
  'in progress': 'bg-[#e2eef8] text-[#356a96]',
  completed: 'bg-[#e6f0e7] text-[#397044]',
  cancelled: 'bg-[#f7e5e1] text-[#9c4b40]',
  pending: 'bg-[#f7ead5] text-[#9b651c]',
  rejected: 'bg-[#f7e5e1] text-[#9c4b40]',
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '' });

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
    try {
      await api.patch(`/appointments/${id}/status`, { status: 'cancelled' });
      setToast({ show: true, message: 'Appointment cancelled.' });
      load();
    } catch (err) {
      setToast({ show: true, message: err.response?.data?.message || 'Could not cancel appointment.' });
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 rise">
      <Link to="/dashboard" className="text-sm text-[#a16e45]">← Dashboard</Link>
      <h1 className="serif mt-4 text-3xl">Your appointments</h1>
      {appointments.length ? (
        <div className="mt-8 grid gap-4">
          {appointments.map((appt) => {
            const status = appt.status?.toLowerCase();
            const isConfirmed = status === 'confirmed';
            const isCompleted = status === 'completed';
            return (
              <SoftCard key={appt._id} className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-5">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClasses[status] || 'bg-[#eee8f6] text-[#6b5888]'}`}>
                        {statusLabels[status] || appt.status}
                      </span>
                      <span className="text-[#746a61]">{formatDate(appt.date)} · {formatTime(appt.startTime)}</span>
                    </div>
                    <h3 className="serif mt-4 text-2xl">{appt.serviceId?.name || 'Appointment'}</h3>
                    <div className="mt-2 grid gap-1 text-sm text-[#746a61] sm:flex sm:flex-wrap sm:gap-x-4">
                      <span>{appt.salonId?.name || 'Salon'}</span>
                      <span>Stylist: {appt.staffId?.name || 'Assigned stylist'}</span>
                    </div>
                    <p className="mt-4 font-semibold text-[#a16e45]">Total {formatPrice(appt.price)}</p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-3">
                    {isConfirmed ? (
                      <button type="button" className="text-sm font-semibold text-[#a45345]" onClick={() => cancel(appt._id)}>
                        Cancel
                      </button>
                    ) : null}
                    {isCompleted ? (
                      <Button variant="luxury" onClick={() => setToast({ show: true, message: 'Review submission is not available yet.' })}>
                        Leave a Review
                      </Button>
                    ) : null}
                  </div>
                </div>
              </SoftCard>
            );
          })}
        </div>
      ) : (
        <SoftCard className="mt-8 p-8 text-center">
          <h2 className="serif text-2xl">No appointments yet</h2>
          <p className="mt-2 text-sm text-[#746a61]">Your next beautiful moment is waiting.</p>
          <Link to="/book" className="mt-5 inline-block"><Button variant="luxury">Book an appointment</Button></Link>
        </SoftCard>
      )}

      <Toast message={toast.message} show={toast.show} onHide={() => setToast({ show: false, message: '' })} />
    </div>
  );
}

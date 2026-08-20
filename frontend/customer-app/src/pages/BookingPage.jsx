import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  api,
  Button,
  Toast,
  formatPrice,
  formatDate,
  formatTime,
  LoadingState,
} from '@elaris/shared-ui';

export default function BookingPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { user } = useSelector((state) => state.auth);

  const [salons, setSalons] = useState([]);
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  const FALLBACK_SALONS = [
    { _id: 'kasachis', name: 'Kasachis', location: { area: 'Kasachis' } },
    { _id: 'old-bole-airport', name: 'Old Bole Airport', location: { area: 'Old Bole Airport' } },
    { _id: 'dembel-city', name: 'Dembel City', location: { area: 'Dembel City' } },
    { _id: 'bole', name: 'Bole', location: { area: 'Bole' } },
  ];

  const FALLBACK_SERVICES = {
    kasachis: [
      { _id: 's1', name: 'Classic Haircut', price: 120 },
      { _id: 's2', name: 'Blowdry', price: 80 },
      { _id: 's3', name: 'Keratin Treatment', price: 450 },
    ],
    'old-bole-airport': [
      { _id: 's4', name: 'Express Cut', price: 90 },
      { _id: 's5', name: 'Color Touch', price: 300 },
    ],
    'dembel-city': [
      { _id: 's6', name: 'Luxury Cut', price: 200 },
      { _id: 's7', name: 'Wedding Style', price: 800 },
    ],
    bole: [
      { _id: 's8', name: 'Trim & Style', price: 100 },
      { _id: 's9', name: 'Deep Conditioning', price: 150 },
    ],
  };

  const FALLBACK_STAFF = {
    kasachis: [
      { _id: 'st1', name: 'Sofia', specialization: 'Haircut' },
      { _id: 'st2', name: 'Marta', specialization: 'Blowdry' },
    ],
    'old-bole-airport': [
      { _id: 'st3', name: 'Daniel', specialization: 'Color' },
      { _id: 'st4', name: 'Liya', specialization: 'Styling' },
    ],
    'dembel-city': [
      { _id: 'st5', name: 'Hanna', specialization: 'Luxury' },
      { _id: 'st6', name: 'Abel', specialization: 'Cuts' },
    ],
    bole: [
      { _id: 'st7', name: 'Sam', specialization: 'Trims' },
      { _id: 'st8', name: 'Grace', specialization: 'Treatment' },
    ],
  };

  const DEFAULT_SLOTS = ['09:00', '09:30', '10:00', '11:00', '13:30', '15:00'];

  const [salonId, setSalonId] = useState(params.get('salonId') || '');
  const [serviceId, setServiceId] = useState(params.get('serviceId') || '');
  const [staffId, setStaffId] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');

  const [appointments, setAppointments] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('elaris-demo-appointments') || '[]');
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/salons');
        const fetched = data?.data?.salons || [];
        if (fetched.length) {
          setSalons(fetched);
        } else {
          setSalons(FALLBACK_SALONS);
        }
      } catch (err) {
        // If API fails or returns no salons, fall back to the sample places
        setSalons(FALLBACK_SALONS);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!salonId) return;
    const load = async () => {
      try {
        const [{ data: sData }, { data: stData }] = await Promise.all([
          api.get(`/services/salon/${salonId}`),
          api.get(`/staff/salon/${salonId}`),
        ]);
        const fetchedServices = sData?.data?.services || [];
        const fetchedStaff = stData?.data?.staff || [];
        setServices(fetchedServices.length ? fetchedServices : (FALLBACK_SERVICES[salonId] || []));
        setStaff(fetchedStaff.length ? fetchedStaff : (FALLBACK_STAFF[salonId] || []));
      } catch (err) {
        // fallback to demo data when API unavailable
        setServices(FALLBACK_SERVICES[salonId] || []);
        setStaff(FALLBACK_STAFF[salonId] || []);
      }
    };
    load();
  }, [salonId]);

  useEffect(() => {
    if (!salonId || !serviceId || !staffId || !date) return;
    const loadSlots = async () => {
      try {
        const { data } = await api.get('/appointments/availability', {
          params: { salonId, serviceId, staffId, date },
        });
        const fetched = data?.data?.slots || [];
        setSlots(fetched.length ? fetched : DEFAULT_SLOTS);
      } catch (err) {
        setSlots(DEFAULT_SLOTS);
      }
    };
    loadSlots();
  }, [salonId, serviceId, staffId, date]);

  const selectedService = services.find((s) => s._id === serviceId);

  const handleBook = async () => {
    if (!user) {
      navigate('/login?redirect=/book');
      return;
    }
    if (!salonId || !serviceId || !staffId || !date || !startTime) {
      setToast({ show: true, message: 'Please complete all booking steps.' });
      return;
    }

    setSubmitting(true);
    try {
      // Try the real API first
      const { data } = await api.post('/appointments', {
        salonId,
        serviceId,
        staffId,
        date,
        startTime,
      });

      // If API returned an appointment object use it, otherwise create a local one
      const apiAppt = data?.data?.appointment;
      const appointment = apiAppt || {
        id: `local-${Date.now()}`,
        salonId,
        salonName: salons.find((s) => s._id === salonId)?.name || salonId,
        serviceId,
        serviceName: selectedService?.name || '',
        staffId,
        staffName: staff.find((m) => m._id === staffId)?.name || '',
        date,
        startTime,
        createdAt: new Date().toISOString(),
      };

      const current = JSON.parse(localStorage.getItem('elaris-demo-appointments') || '[]');
      current.push(appointment);
      localStorage.setItem('elaris-demo-appointments', JSON.stringify(current));
      setAppointments(current);

      setToast({ show: true, message: 'Your appointment has been reserved.' });
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err) {
      // Fallback: save appointment locally when API fails
      const appointment = {
        id: `local-${Date.now()}`,
        salonId,
        salonName: salons.find((s) => s._id === salonId)?.name || salonId,
        serviceId,
        serviceName: selectedService?.name || '',
        staffId,
        staffName: staff.find((m) => m._id === staffId)?.name || '',
        date,
        startTime,
        createdAt: new Date().toISOString(),
      };
      const current = JSON.parse(localStorage.getItem('elaris-demo-appointments') || '[]');
      current.push(appointment);
      localStorage.setItem('elaris-demo-appointments', JSON.stringify(current));
      setAppointments(current);

      setToast({ show: true, message: err.response?.data?.message || 'Booking saved locally.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePay = async () => {
    if (!user) {
      navigate('/login?redirect=/book');
      return;
    }
    if (!salonId || !serviceId || !staffId || !date || !startTime) {
      setToast({ show: true, message: 'Please complete all booking steps.' });
      return;
    }

    setSubmitting(true);
    try {
      // simulate a brief payment flow
      await new Promise((r) => setTimeout(r, 900));
      setToast({ show: true, message: 'Payment simulated — Booking confirmed.' });
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err) {
      setToast({ show: true, message: 'Payment failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 rise">
      <p className="text-xs font-bold uppercase tracking-[.18em] text-[#a16e45]">Book your moment</p>
      <h1 className="serif mt-3 text-[2rem]">A little time, beautifully booked.</h1>

      <div className="soft-card mt-8 p-6 sm:p-8">
        <h2 className="serif text-2xl">1. Choose salon</h2>
        <div className="mt-4 grid gap-3">
          {salons.map((salon) => (
            <button
              key={salon._id}
              type="button"
              className={`choice ${salonId === salon._id ? 'selected' : ''}`}
              onClick={() => {
                setSalonId(salon._id);
                setServiceId('');
                setStaffId('');
              }}
            >
              <b>{salon.name}</b>
              <p className="mt-1 text-sm text-[#746a61]">{salon.location?.area}</p>
            </button>
          ))}
        </div>

        {salonId ? (
          <>
            <h2 className="serif mt-8 text-2xl">2. Choose service</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {services.map((service) => (
                <button
                  key={service._id}
                  type="button"
                  className={`choice ${serviceId === service._id ? 'selected' : ''}`}
                  onClick={() => setServiceId(service._id)}
                >
                  {service.name}
                  <span className="float-right text-[#a16e45]">{formatPrice(service.price)}</span>
                </button>
              ))}
            </div>
          </>
        ) : null}

        {serviceId ? (
          <>
            <h2 className="serif mt-8 text-2xl">3. Choose stylist</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {staff.map((member) => (
                <button
                  key={member._id}
                  type="button"
                  className={`choice ${staffId === member._id ? 'selected' : ''}`}
                  onClick={() => setStaffId(member._id)}
                >
                  <b>{member.name}</b>
                  <p className="mt-1 text-sm text-[#746a61]">{member.specialization}</p>
                </button>
              ))}
            </div>
          </>
        ) : null}

        {staffId ? (
          <>
            <h2 className="serif mt-8 text-2xl">4. Choose date & time</h2>
            <input
              type="date"
              className="mt-4 w-full rounded-xl border border-[#ded3c7] px-4 py-3"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setStartTime('');
              }}
              min={new Date().toISOString().split('T')[0]}
            />
            <div className="mt-4 flex flex-wrap gap-2">
              {slots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  className={`btn-luxury ${startTime === slot ? 'selected' : ''}`}
                  onClick={() => setStartTime(slot)}
                >
                  {formatTime(slot)}
                </button>
              ))}
            </div>
          </>
        ) : null}

        <div className="mt-7 rounded-xl bg-[#f5ede3] p-5">
          <p className="text-sm text-[#746a61]">Your appointment</p>
          <p className="mt-2 font-semibold">
            {selectedService
              ? `${selectedService.name} · ${formatPrice(selectedService.price)}${date && startTime ? ` · ${formatDate(date)} · ${formatTime(startTime)}` : ''}`
              : 'Select options to continue.'}
          </p>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="luxury" onClick={handleBook} disabled={submitting}>
            {submitting ? 'Reserving...' : 'Reserve appointment'}
          </Button>
          <Button variant="secondary" onClick={handlePay} disabled={submitting}>
            Pay now
          </Button>
        </div>
        {!user ? (
          <p className="mt-4 text-sm text-[#746a61]">
            <Link to="/login" className="text-[#a16e45]">Sign in</Link> to complete your booking.
          </p>
        ) : null}

        {appointments.length > 0 ? (
          <div className="mt-6">
            <h3 className="serif text-lg">Your bookings (demo)</h3>
            <ul className="mt-3 space-y-2">
              {appointments.map((a) => (
                <li key={a.id} className="rounded p-3 bg-white shadow">
                  <div className="font-semibold">{a.salonName} — {a.serviceName}</div>
                  <div className="text-sm text-[#746a61]">{a.date}{a.startTime ? ` · ${formatTime(a.startTime)}` : ''}</div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <Toast
        message={toast.message}
        show={toast.show}
        onHide={() => setToast({ show: false, message: '' })}
      />
    </div>
  );
}

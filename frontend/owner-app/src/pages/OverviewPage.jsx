import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, StatCard, SoftCard, LoadingState, formatTime } from '@elaris/shared-ui';

export default function OverviewPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/owner/dashboard').then(({ data: res }) => setData(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState />;
  const { stats, todaySchedule, salon } = data || {};

  return (
    <>
      <p className="text-xs font-bold uppercase tracking-[.18em] text-[#a16e45]">{salon?.name || 'Your salon'}</p>
      <h1 className="serif mt-3 text-[2rem]">Good morning, {salon?.name || 'there'}.</h1>
      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Today's appointments" value={stats?.todayAppointments ?? 0} hint={`${stats?.pendingCount ?? 0} awaiting confirmation`} />
        <StatCard label="Weekly revenue" value={`${((stats?.weeklyRevenue ?? 0) / 1000).toFixed(1)}k ETB`} hint="+12% vs last week" />
        <StatCard label="New reviews" value={stats?.newReviews ?? 0} hint={`${stats?.rating ?? 0} average rating`} />
        <StatCard label="Occupancy" value={`${stats?.occupancy ?? 0}%`} hint="Peak: 11 AM–2 PM" />
      </div>
      <div className="mt-7 grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
        <SoftCard className="p-6">
          <div className="flex justify-between">
            <h2 className="serif text-xl">Today's schedule</h2>
            <Link to="/schedule" className="text-sm font-semibold text-[#a16e45]">Open schedule →</Link>
          </div>
          <div className="mt-5 space-y-4">
            {(todaySchedule || []).slice(0, 4).map((item) => (
              <div key={item._id} className="flex gap-4 border-l-2 border-[#a16e45] pl-4">
                <b className="w-20">{formatTime(item.startTime)}</b>
                <span>
                  <b>{item.customerId?.name}</b>
                  <br />
                  <small className="text-[#746a61]">{item.serviceId?.name} · {item.staffId?.name}</small>
                </span>
              </div>
            ))}
          </div>
        </SoftCard>
        <SoftCard className="p-6">
          <h2 className="serif text-xl">Booking insight</h2>
          <p className="mt-5 text-3xl font-semibold">11 AM</p>
          <p className="mt-1 text-sm text-[#746a61]">Your busiest hour this week.</p>
        </SoftCard>
      </div>
    </>
  );
}

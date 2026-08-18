import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, StatCard, SoftCard, LoadingState } from '@elaris/shared-ui';

export default function OverviewPage() {
  const [data, setData] = useState(null);
  useEffect(() => { api.get('/admin/stats').then(({ data: res }) => setData(res.data)); }, []);
  if (!data) return <LoadingState />;
  const { stats, bookingVolume } = data;
  const max = Math.max(...bookingVolume, 1);
  return (
    <>
      <p className="text-xs font-bold uppercase tracking-[.18em] text-[#a16e45]">Platform performance</p>
      <h1 className="serif mt-3 text-[2rem]">A clear view of Elaris.</h1>
      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total salons" value={stats.totalSalons} hint="+12 this month" />
        <StatCard label="Customers" value={stats.customers.toLocaleString()} hint="+8.4%" />
        <StatCard label="Bookings" value={stats.bookings.toLocaleString()} hint="+14.2%" />
        <StatCard label="Revenue" value={`${(stats.revenue / 1000).toFixed(1)}k ETB`} hint="+10.1%" />
      </div>
      <div className="mt-7 grid gap-6 xl:grid-cols-[1.3fr_.7fr]">
        <SoftCard className="p-6">
          <div className="flex justify-between"><h2 className="serif text-xl">Booking volume</h2><span className="text-sm text-[#746a61]">Last 7 days</span></div>
          <div className="chart-bars mt-6">
            {bookingVolume.map((v, i) => <span key={i} style={{ height: `${(v / max) * 100}%` }} />)}
          </div>
        </SoftCard>
        <SoftCard className="p-6">
          <h2 className="serif text-xl">System alerts</h2>
          <p className="mt-5 text-sm"><b>{stats.pendingSalons} salons await review</b><br /><span className="text-[#746a61]">New registrations pending.</span></p>
          <Link to="/salons" className="mt-4 inline-block text-sm font-semibold text-[#a16e45]">Review queue →</Link>
        </SoftCard>
      </div>
    </>
  );
}

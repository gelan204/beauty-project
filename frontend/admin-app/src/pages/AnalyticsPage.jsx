import { useEffect, useState } from 'react';
import { api, SoftCard, LoadingState } from '@elaris/shared-ui';

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  useEffect(() => { api.get('/admin/analytics').then(({ data: res }) => setData(res.data)); }, []);
  if (!data) return <LoadingState />;
  return (
    <>
      <h1 className="serif text-3xl">Analytics</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <SoftCard className="p-6">
          <h2 className="serif text-xl">Peak booking hours</h2>
          <div className="chart-bars mt-5">
            {data.peakHours.map((h, i) => <span key={i} style={{ height: `${h}%` }} />)}
          </div>
          <p className="mt-3 text-sm text-[#746a61]">Peak demand: 11 AM–2 PM</p>
        </SoftCard>
        <SoftCard className="p-6">
          <h2 className="serif text-xl">Service popularity</h2>
          <div className="mt-5 space-y-4 text-sm">
            {data.servicePopularity.map((item) => (
              <div key={item.name}>
                <p>{item.name} <span className="float-right font-bold">{item.percentage}%</span></p>
                <div className="mt-2 h-2 rounded bg-[#eee5d8]"><div className="h-2 rounded bg-[#a16e45]" style={{ width: `${item.percentage}%` }} /></div>
              </div>
            ))}
          </div>
        </SoftCard>
      </div>
    </>
  );
}

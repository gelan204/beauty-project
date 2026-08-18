import { useEffect, useState } from 'react';
import { api, Button, SoftCard, Toast } from '@elaris/shared-ui';

export default function AvailabilityPage() {
  const [status, setStatus] = useState('active');
  const [toast, setToast] = useState({ show: false, message: '' });
  useEffect(() => { api.get('/staff/me').then(({ data }) => setStatus(data.data.staff.status)); }, []);
  const save = async () => {
    await api.patch('/staff/me/availability', { status });
    setToast({ show: true, message: 'Availability updated.' });
  };
  return (
    <>
      <h1 className="serif text-3xl">Update availability</h1>
      <SoftCard className="mt-6 max-w-md p-6">
        <label className="text-sm font-semibold">Status</label>
        <select className="mt-2 w-full rounded-xl border border-[#ded3c7] px-4 py-3" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="active">Available</option>
          <option value="away">Away</option>
          <option value="inactive">Inactive</option>
        </select>
        <Button className="mt-4" onClick={save}>Save</Button>
      </SoftCard>
      <Toast message={toast.message} show={toast.show} onHide={() => setToast({ show: false, message: '' })} />
    </>
  );
}

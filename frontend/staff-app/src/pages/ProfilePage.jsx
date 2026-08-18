import { useSelector } from 'react-redux';
import { SoftCard } from '@elaris/shared-ui';

export default function ProfilePage() {
  const { user } = useSelector((s) => s.auth);
  return (
    <>
      <h1 className="serif text-3xl">Staff profile</h1>
      <SoftCard className="mt-6 max-w-md p-6">
        <p><b>Name:</b> {user?.name}</p>
        <p className="mt-2"><b>Email:</b> {user?.email}</p>
        <p className="mt-2"><b>Phone:</b> {user?.phone || '—'}</p>
      </SoftCard>
    </>
  );
}

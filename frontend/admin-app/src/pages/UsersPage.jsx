import { useEffect, useState } from 'react';
import { api, StatCard, SoftCard } from '@elaris/shared-ui';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  useEffect(() => { api.get('/users').then(({ data }) => setUsers(data.data.users)); }, []);
  const counts = {
    customer: users.filter((u) => u.role === 'customer').length,
    owner: users.filter((u) => u.role === 'owner').length,
    admin: users.filter((u) => u.role === 'admin').length,
  };
  return (
    <>
      <h1 className="serif text-3xl">User management</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Customers" value={counts.customer} />
        <StatCard label="Salon owners" value={counts.owner} />
        <StatCard label="Admins" value={counts.admin} />
      </div>
      <SoftCard className="mt-6 p-5">
        <p className="font-semibold">Recent users</p>
        <div className="mt-4 space-y-4 text-sm">
          {users.slice(0, 8).map((user) => (
            <div key={user._id} className="flex justify-between border-b border-[#eee3d8] pb-3">
              <span>{user.name} · {user.role}</span>
              <span className="text-[#746a61]">{user.email}</span>
            </div>
          ))}
        </div>
      </SoftCard>
    </>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, LoadingState, Button } from '@elaris/shared-ui';

export default function SalonsPage() {
  const [salons, setSalons] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    api
      .get(`/salons?${params}`)
      .then(({ data }) => setSalons(data.data.salons))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8 rise">
      <p className="text-xs font-bold uppercase tracking-[.18em] text-[#a16e45]">Near you</p>
      <h1 className="serif mt-3 text-[2rem]">Your kind of salon.</h1>
      <div className="mt-6 flex flex-wrap gap-3">
        <input
          className="rounded-full border border-[#dfd4c8] bg-white px-4 py-2 text-sm outline-none"
          placeholder="Search salons or areas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="rounded-full border border-[#dfd4c8] bg-white px-4 py-2 text-sm"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All categories</option>
          <option value="Hair & beauty">Hair & beauty</option>
          <option value="Nails & skincare">Nails & skincare</option>
          <option value="Grooming">Grooming</option>
        </select>
        <Button variant="luxury" onClick={load}>Search</Button>
      </div>
      {loading ? (
        <LoadingState />
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {salons.map((salon) => (
            <div key={salon._id} className="soft-card p-6">
              <h3 className="font-semibold">{salon.name}</h3>
              <p className="mt-2 text-sm text-[#746a61]">
                {salon.location?.area} · ★ {salon.rating?.toFixed(1)}
              </p>
              <Link to={`/salons/${salon._id}`} className="mt-5 inline-block text-sm font-semibold text-[#a16e45]">
                View availability →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

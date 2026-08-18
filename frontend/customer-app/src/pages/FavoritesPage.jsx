import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, LoadingState } from '@elaris/shared-ui';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/salons/favorites/list')
      .then(({ data }) => setFavorites(data.data.favorites))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState />;

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 rise">
      <h1 className="serif text-3xl">Favourite salons</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {favorites.length ? favorites.map((fav) => (
          <Link key={fav._id} to={`/salons/${fav.salonId?._id}`} className="soft-card block p-6 no-underline text-inherit">
            <h3 className="font-semibold">{fav.salonId?.name}</h3>
            <p className="mt-2 text-sm text-[#746a61]">{fav.salonId?.location?.area}</p>
          </Link>
        )) : (
          <p className="text-[#746a61]">No favourites yet. Browse <Link to="/salons" className="text-[#a16e45]">salons</Link>.</p>
        )}
      </div>
    </div>
  );
}

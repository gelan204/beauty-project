import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, formatPrice, LoadingState, Button } from '@elaris/shared-ui';

export default function SalonDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/salons/${id}`)
      .then(({ data: res }) => setData(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingState />;
  if (!data) return <div className="p-12 text-center">Salon not found.</div>;

  const { salon, services, staff, reviews } = data;

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8 rise">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr]">
        <div>
          <img
            className="h-72 w-full rounded-[1.5rem] object-cover"
            src={salon.images?.[0] || 'https://images.pexels.com/photos/7750124/pexels-photo-7750124.jpeg?auto=compress&cs=tinysrgb&w=800'}
            alt={salon.name}
          />
          <h1 className="serif mt-6 text-4xl">{salon.name}</h1>
          <p className="mt-3 text-[#746a61]">{salon.description}</p>
          <p className="mt-2 text-sm">★ {salon.rating?.toFixed(1)} · {salon.location?.area}</p>

          <h2 className="serif mt-10 text-2xl">Services</h2>
          <div className="mt-4 grid gap-3">
            {services.map((service) => (
              <Link
                key={service._id}
                to={`/book?salonId=${salon._id}&serviceId=${service._id}`}
                className="choice block no-underline text-inherit"
              >
                <b>{service.name}</b>
                <span className="float-right text-[#a16e45]">{formatPrice(service.price)}</span>
                <p className="mt-2 text-sm text-[#746a61]">{service.duration} min</p>
              </Link>
            ))}
          </div>

          <h2 className="serif mt-10 text-2xl">Team</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {staff.map((member) => (
              <div key={member._id} className="soft-card p-5">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[#e7d4bf] font-semibold">
                  {member.name.charAt(0)}
                </div>
                <h3 className="mt-4 font-semibold">{member.name}</h3>
                <p className="mt-1 text-sm text-[#746a61]">{member.specialization}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="soft-card h-fit p-6">
          <h2 className="serif text-xl">Book at {salon.name}</h2>
          <p className="mt-3 text-sm text-[#746a61]">{salon.phone}</p>
          <Link to={`/book?salonId=${salon._id}`} className="mt-6 inline-block">
            <Button variant="luxury" className="w-full">Book appointment</Button>
          </Link>
          {reviews?.length ? (
            <div className="mt-8 border-t border-[#eee3d8] pt-6">
              <h3 className="font-semibold">Recent reviews</h3>
              {reviews.slice(0, 2).map((review) => (
                <p key={review._id} className="mt-4 text-sm text-[#746a61]">
                  “{review.comment}”
                </p>
              ))}
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

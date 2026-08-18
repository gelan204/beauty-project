import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, Button, LoadingState } from '@elaris/shared-ui';

export default function HomePage() {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/salons')
      .then(({ data }) => setSalons(data.data.salons.slice(0, 3)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-5 py-7 lg:px-8 lg:py-10 rise">
      <div className="grid overflow-hidden rounded-[2rem] bg-[#eee4d5] lg:grid-cols-[1.04fr_.96fr]">
        <div className="flex min-h-[470px] flex-col justify-center px-7 py-14 sm:px-12 lg:px-16">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-[#a16e45]">Beauty, on your terms</p>
          <h1 className="serif mt-5 max-w-xl text-[clamp(2.5rem,5vw,3.6rem)] leading-[1.03]">
            Your Beauty, Your Time.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-7 text-[#625950]">
            Discover exceptional salons and book the care you deserve—simply, elegantly, and on your schedule.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/book"><Button variant="luxury">Book an Appointment</Button></Link>
            <Link to="/services"><Button variant="luxury">Explore Services</Button></Link>
          </div>
          <p className="mt-12 text-sm text-[#6d6258]">Trusted by 50,000+ beauty lovers</p>
        </div>
        <div className="relative min-h-[400px]">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src="https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Professional hair stylist washing woman's hair in a modern salon setting."
          />
          <div className="absolute bottom-6 left-6 rounded-2xl bg-[#fffdf9e8] px-5 py-4">
            <p className="text-xs uppercase tracking-widest text-[#8b7c6d]">Curated care</p>
            <p className="mt-1 font-semibold">Beauty, on your schedule.</p>
          </div>
        </div>
      </div>

      <section className="py-16">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#a16e45]">Made for your ritual</p>
            <h2 className="serif mt-3 text-2xl">A little time for yourself.</h2>
          </div>
          <Link to="/services" className="text-sm font-semibold text-[#a16e45]">See all services →</Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ['✂ Haircut', 'Precision, tailored', '/book'],
            ['◒ Coloring', 'Rich dimension', '/book'],
            ['✦ Makeup', 'Your best finish', '/book'],
            ['☼ Facial', 'Restorative care', '/book'],
          ].map(([title, desc, to]) => (
            <Link key={title} to={to} className="choice block no-underline text-inherit">
              <b>{title}</b>
              <p className="mt-2 text-sm text-[#746a61]">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="pb-16">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#a16e45]">Loved locally</p>
            <h2 className="serif mt-3 text-2xl">Exceptional salons, nearby.</h2>
          </div>
          <Link to="/salons" className="text-sm font-semibold text-[#a16e45]">Explore salons →</Link>
        </div>
        {loading ? (
          <LoadingState />
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {salons.map((salon) => (
              <article key={salon._id} className="soft-card overflow-hidden">
                <img
                  className="h-52 w-full object-cover"
                  src={salon.images?.[0] || 'https://images.pexels.com/photos/7750124/pexels-photo-7750124.jpeg?auto=compress&cs=tinysrgb&w=800'}
                  alt={salon.name}
                />
                <div className="p-5">
                  <div className="flex justify-between">
                    <h3 className="font-semibold">{salon.name}</h3>
                    <span>★ {salon.rating?.toFixed(1)}</span>
                  </div>
                  <p className="mt-2 text-sm text-[#746a61]">
                    {salon.location?.area} · {salon.categories?.[0]}
                  </p>
                  <Link to={`/book?salonId=${salon._id}`} className="mt-5 inline-block text-sm font-semibold text-[#a16e45]">
                    Book now →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, formatPrice, LoadingState } from '@elaris/shared-ui';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/services')
      .then(({ data }) => setServices(data.data.services))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8 rise">
      <p className="text-xs font-bold uppercase tracking-[.18em] text-[#a16e45]">Discover treatments</p>
      <h1 className="serif mt-3 text-[2rem]">Find your next ritual.</h1>
      <p className="mt-4 max-w-xl leading-7 text-[#675e55]">
        From precision cuts to restorative skin treatments, discover thoughtful services by exceptional local experts.
      </p>
      {loading ? (
        <LoadingState />
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service._id}
              to={`/book?salonId=${service.salonId?._id || service.salonId}&serviceId=${service._id}`}
              className="choice block no-underline text-inherit"
            >
              <b>{service.name}</b>
              <span className="float-right text-[#a16e45]">{formatPrice(service.price)}</span>
              <p className="mt-3 text-sm text-[#746a61]">
                {service.duration} min · {service.salonId?.name || 'Salon'}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

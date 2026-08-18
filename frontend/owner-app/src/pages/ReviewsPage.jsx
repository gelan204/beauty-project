import { useEffect, useState } from 'react';
import { api, SoftCard, LoadingState } from '@elaris/shared-ui';

export default function ReviewsPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/admin/owner/reviews').then(({ data: res }) => setData(res.data));
  }, []);

  if (!data) return <LoadingState />;

  return (
    <>
      <h1 className="serif text-3xl">Reviews & ratings</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[.45fr_1fr]">
        <SoftCard className="p-6">
          <p className="serif text-5xl">{data.rating?.toFixed(1)}</p>
          <p className="mt-2 text-[#a16e45]">★★★★★</p>
          <p className="mt-2 text-sm text-[#746a61]">Based on {data.count} reviews</p>
        </SoftCard>
        <div className="grid gap-4">
          {data.reviews.map((review) => (
            <SoftCard key={review._id} className="p-6">
              <p>“{review.comment}”</p>
              <p className="mt-4 text-sm font-semibold">{review.customerId?.name} · {'★'.repeat(review.rating)}</p>
            </SoftCard>
          ))}
        </div>
      </div>
    </>
  );
}

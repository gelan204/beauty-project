import { useEffect, useState } from 'react';
import { api, Button, Toast, LoadingState } from '@elaris/shared-ui';

export default function GalleryPage() {
  const [salon, setSalon] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '' });

  useEffect(() => {
    api.get('/salons/mine').then(({ data }) => setSalon(data.data.salon));
  }, []);

  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const body = new FormData();
    body.append('images', file);
    await api.post('/salons/mine/images', body, { headers: { 'Content-Type': 'multipart/form-data' } });
    setToast({ show: true, message: 'Photo uploaded.' });
    const res = await api.get('/salons/mine');
    setSalon(res.data.data.salon);
  };

  if (!salon) return <LoadingState />;

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="serif text-3xl">Gallery & portfolio</h1>
        <label className="btn-primary cursor-pointer">
          Add photo
          <input type="file" accept="image/*" className="hidden" onChange={upload} />
        </label>
      </div>
      <p className="mt-4 text-sm text-[#746a61]">{salon.images?.length || 0} published salon photos</p>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
        {(salon.images || []).map((img) => (
          <img key={img} src={img.startsWith('http') ? img : `http://localhost:5000${img}`} alt="Salon" className="aspect-square w-full rounded-2xl object-cover" />
        ))}
      </div>
      <Toast message={toast.message} show={toast.show} onHide={() => setToast({ show: false, message: '' })} />
    </>
  );
}

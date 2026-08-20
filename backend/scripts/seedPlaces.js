import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Salon from '../models/Salon.js';
import Service from '../models/Service.js';

dotenv.config();

const defaultHours = {
  monday: { open: '09:00', close: '20:00', closed: false },
  tuesday: { open: '09:00', close: '20:00', closed: false },
  wednesday: { open: '09:00', close: '20:00', closed: false },
  thursday: { open: '09:00', close: '20:00', closed: false },
  friday: { open: '09:00', close: '20:00', closed: false },
  saturday: { open: '09:00', close: '20:00', closed: false },
  sunday: { open: '09:00', close: '18:00', closed: true },
};

const PLACES = [
  {
    area: 'Bole',
    salons: [
      { name: 'Bole Beauty Lounge', description: 'Modern cuts and color in Bole.' },
      { name: 'Bole Hair Atelier', description: 'Artisanal styling and treatments.' },
    ],
  },
  {
    area: 'Kazanchis',
    salons: [
      { name: 'Kazanchis Glow Studio', description: 'Nails, skin and glow treatments.' },
      { name: 'Kazanchis Barber & Co', description: 'Classic and modern grooming.' },
    ],
  },
  {
    area: 'Piassa',
    salons: [
      { name: 'Piassa Hair & Beauty', description: 'Heritage beauty services in Piassa.' },
    ],
  },
  {
    area: 'CMC',
    salons: [
      { name: 'CMC Style House', description: 'Contemporary salon near CMC.' },
    ],
  },
  {
    area: 'Megenagna',
    salons: [
      { name: 'Megenagna Salon Lounge', description: 'Relaxed styling and treatments.' },
    ],
  },
  {
    area: 'Sarbet',
    salons: [
      { name: 'Sarbet Beauty Bar', description: 'Quick beauty fixes and styling.' },
    ],
  },
];

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const placeholderImages = [
  'https://images.pexels.com/photos/3992874/pexels-photo-3992874.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/7750124/pexels-photo-7750124.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=800',
];

const getRandom = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const main = async () => {
  const mongoUrl = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/elaris';
  await mongoose.connect(mongoUrl);
  console.log('Connected to MongoDB at', mongoUrl);

  let createdOwners = 0;
  let createdSalons = 0;
  let createdServices = 0;

  for (const place of PLACES) {
    const { area, salons } = place;

    for (const s of salons) {
      const salonName = s.name;

      // Skip if salon exists
      const exists = await Salon.findOne({ name: salonName });
      if (exists) {
        console.log(`Skip: Salon already exists -> ${salonName}`);
        continue;
      }

      // Ensure owner user exists (unique email based on salon name)
      const ownerEmail = `${slugify(salonName)}@owners.elaris.local`;
      let owner = await User.findOne({ email: ownerEmail });
      if (!owner) {
        owner = await User.create({
          name: `${s.name} Owner`,
          email: ownerEmail,
          password: 'owner123',
          role: 'owner',
          phone: '+251 911 000 000',
        });
        createdOwners += 1;
        console.log(`Created owner user: ${ownerEmail}`);
      } else {
        console.log(`Owner exists: ${ownerEmail}`);
      }

      // Create salon
      const salon = await Salon.create({
        ownerId: owner._id,
        name: salonName,
        description: s.description || `${salonName} — quality hair and beauty services in ${area}.`,
        location: { area, city: 'Addis Ababa' },
        images: placeholderImages,
        openingHours: defaultHours,
        categories: ['Hair & beauty'],
        rating: (Math.random() * 1.5 + 4.0).toFixed(1) * 1,
        reviewCount: getRandom(10, 200),
        status: 'approved',
      });
      createdSalons += 1;
      console.log(`Created salon: ${salonName} (${area})`);

      // Create one featured service per salon
      const price = getRandom(400, 1200);
      const service = await Service.create({
        salonId: salon._id,
        name: `${salonName} — Signature Service`,
        description: `Featured service at ${salonName}`,
        price,
        duration: 45,
        category: 'Hair',
        featured: true,
      });
      createdServices += 1;
      console.log(`  → Created service: ${service.name} (${price} ETB)`);
    }
  }

  console.log('--- Summary ---');
  console.log(`Owners created: ${createdOwners}`);
  console.log(`Salons created: ${createdSalons}`);
  console.log(`Services created: ${createdServices}`);

  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
};

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

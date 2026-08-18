import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Salon from '../models/Salon.js';
import Service from '../models/Service.js';
import Staff from '../models/Staff.js';
import Appointment from '../models/Appointment.js';
import Notification from '../models/Notification.js';
import Review from '../models/Review.js';

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

const staffAvailability = {
  monday: { start: '09:00', end: '18:00', available: true },
  tuesday: { start: '09:00', end: '18:00', available: true },
  wednesday: { start: '09:00', end: '18:00', available: true },
  thursday: { start: '09:00', end: '18:00', available: true },
  friday: { start: '09:00', end: '18:00', available: true },
  saturday: { start: '10:00', end: '16:00', available: true },
  sunday: { start: '09:00', end: '18:00', available: false },
};

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/elaris');
  console.log('Connected to MongoDB');

  await Promise.all([
    User.deleteMany({}),
    Salon.deleteMany({}),
    Service.deleteMany({}),
    Staff.deleteMany({}),
    Appointment.deleteMany({}),
    Notification.deleteMany({}),
    Review.deleteMany({}),
  ]);

  const admin = await User.create({
    name: 'Elaris Admin',
    email: 'admin@elaris.co',
    password: 'admin123',
    role: 'admin',
    phone: '+251 911 000 001',
  });

  const customer = await User.create({
    name: 'Liya Mekonnen',
    email: 'liya@elaris.co',
    password: 'customer123',
    role: 'customer',
    phone: '+251 911 000 002',
  });

  const owner1 = await User.create({
    name: 'Hana Abebe',
    email: 'owner@maisonmuse.co',
    password: 'owner123',
    role: 'owner',
    phone: '+251 11 555 0188',
  });

  const owner2 = await User.create({
    name: 'Selam Tesfaye',
    email: 'owner@soleilstudio.co',
    password: 'owner123',
    role: 'owner',
  });

  const owner3 = await User.create({
    name: 'Daniel Kebede',
    email: 'owner@groomingroom.co',
    password: 'owner123',
    role: 'owner',
  });

  const salon1 = await Salon.create({
    ownerId: owner1._id,
    name: 'Maison Muse',
    description: 'Precision hair and beauty in Bole.',
    location: { address: 'Bole Road', city: 'Addis Ababa', area: 'Bole' },
    phone: '+251 11 555 0188',
    email: 'hello@maisonmuse.co',
    images: [
      'https://images.pexels.com/photos/3992874/pexels-photo-3992874.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/7750124/pexels-photo-7750124.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    openingHours: defaultHours,
    categories: ['Hair & beauty'],
    rating: 4.9,
    reviewCount: 186,
    instagram: '@maisonmuse',
    status: 'approved',
  });

  const salon2 = await Salon.create({
    ownerId: owner2._id,
    name: 'Soleil Studio',
    description: 'Nails and skincare rituals in Kazanchis.',
    location: { city: 'Addis Ababa', area: 'Kazanchis' },
    images: [
      'https://images.pexels.com/photos/7750124/pexels-photo-7750124.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    openingHours: {
      ...defaultHours,
      monday: { open: '09:00', close: '19:00', closed: false },
    },
    categories: ['Nails & skincare'],
    rating: 4.8,
    reviewCount: 92,
    status: 'approved',
  });

  const salon3 = await Salon.create({
    ownerId: owner3._id,
    name: 'The Grooming Room',
    description: 'Premium grooming in Old Airport.',
    location: { city: 'Addis Ababa', area: 'Old Airport' },
    images: [
      'https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    openingHours: {
      ...defaultHours,
      monday: { open: '09:00', close: '21:00', closed: false },
    },
    categories: ['Grooming'],
    rating: 4.9,
    reviewCount: 140,
    status: 'approved',
  });

  await Salon.create({
    ownerId: owner2._id,
    name: 'Luna House Studio',
    location: { area: 'Kazanchis', city: 'Addis Ababa' },
    categories: ['Hair & makeup'],
    status: 'pending',
  });

  const cutStyle = await Service.create({
    salonId: salon1._id,
    name: 'Signature Cut & Style',
    description: 'Precision cut tailored to you.',
    price: 650,
    duration: 60,
    category: 'Hair',
    featured: true,
  });

  const color = await Service.create({
    salonId: salon1._id,
    name: 'Dimensional Color',
    description: 'Rich dimensional color.',
    price: 1800,
    duration: 150,
    category: 'Hair',
  });

  const facial = await Service.create({
    salonId: salon2._id,
    name: 'Glow Facial',
    description: 'Restorative glow facial.',
    price: 950,
    duration: 60,
    category: 'Skincare',
    featured: true,
  });

  const staffUser1 = await User.create({
    name: 'Sofia Alemu',
    email: 'sofia@maisonmuse.co',
    password: 'staff123',
    role: 'staff',
  });

  const staffUser2 = await User.create({
    name: 'Aster Gebre',
    email: 'aster@maisonmuse.co',
    password: 'staff123',
    role: 'staff',
  });

  const staffUser3 = await User.create({
    name: 'Eden Tadesse',
    email: 'eden@maisonmuse.co',
    password: 'staff123',
    role: 'staff',
  });

  const sofia = await Staff.create({
    userId: staffUser1._id,
    salonId: salon1._id,
    name: 'Sofia A.',
    specialization: 'Cut & styling',
    services: [cutStyle._id],
    availability: staffAvailability,
    status: 'active',
  });

  const aster = await Staff.create({
    userId: staffUser2._id,
    salonId: salon1._id,
    name: 'Aster G.',
    specialization: 'Color specialist',
    services: [color._id, cutStyle._id],
    availability: {
      ...staffAvailability,
      monday: { start: '10:00', end: '19:00', available: true },
    },
    status: 'active',
  });

  await Staff.create({
    userId: staffUser3._id,
    salonId: salon1._id,
    name: 'Eden T.',
    specialization: 'Makeup artist',
    services: [cutStyle._id],
    availability: staffAvailability,
    status: 'away',
  });

  const appointmentDate = new Date();
  appointmentDate.setDate(appointmentDate.getDate() + 1);
  appointmentDate.setHours(0, 0, 0, 0);

  await Appointment.create({
    customerId: customer._id,
    salonId: salon1._id,
    staffId: sofia._id,
    serviceId: cutStyle._id,
    date: appointmentDate,
    startTime: '10:30',
    endTime: '11:30',
    status: 'confirmed',
    price: 650,
  });

  await Appointment.create({
    customerId: customer._id,
    salonId: salon2._id,
    staffId: sofia._id,
    serviceId: facial._id,
    date: appointmentDate,
    startTime: '12:00',
    endTime: '13:00',
    status: 'pending',
    price: 950,
  });

  await Notification.create({
    userId: customer._id,
    type: 'appointment',
    title: 'Appointment confirmed',
    message: 'Maison Muse · tomorrow at 10:30 AM',
  });

  await Review.create({
    customerId: customer._id,
    salonId: salon1._id,
    rating: 5,
    comment: 'Every detail at Maison Muse is considered. My color has never looked healthier.',
  });

  console.log('Seed complete!');
  console.log('Admin: admin@elaris.co / admin123');
  console.log('Customer: liya@elaris.co / customer123');
  console.log('Owner: owner@maisonmuse.co / owner123');
  console.log('Staff: sofia@maisonmuse.co / staff123');

  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

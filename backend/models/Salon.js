import mongoose from 'mongoose';

const dayHoursSchema = new mongoose.Schema(
  {
    open: { type: String, default: '09:00' },
    close: { type: String, default: '20:00' },
    closed: { type: Boolean, default: false },
  },
  { _id: false }
);

const salonSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    location: {
      address: { type: String, default: '' },
      city: { type: String, default: '' },
      area: { type: String, default: '' },
    },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    images: [{ type: String }],
    openingHours: {
      monday: { type: dayHoursSchema, default: () => ({}) },
      tuesday: { type: dayHoursSchema, default: () => ({}) },
      wednesday: { type: dayHoursSchema, default: () => ({}) },
      thursday: { type: dayHoursSchema, default: () => ({}) },
      friday: { type: dayHoursSchema, default: () => ({}) },
      saturday: { type: dayHoursSchema, default: () => ({}) },
      sunday: { type: dayHoursSchema, default: () => ({ open: '09:00', close: '18:00', closed: true }) },
    },
    categories: [{ type: String }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    instagram: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'suspended'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

salonSchema.index({ status: 1, 'location.city': 1 });
salonSchema.index({ ownerId: 1 });

const Salon = mongoose.model('Salon', salonSchema);
export default Salon;

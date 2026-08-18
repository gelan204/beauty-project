import mongoose from 'mongoose';

const dayAvailabilitySchema = new mongoose.Schema(
  {
    start: { type: String, default: '09:00' },
    end: { type: String, default: '18:00' },
    available: { type: Boolean, default: true },
  },
  { _id: false }
);

const staffSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    salonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Salon', required: true },
    name: { type: String, required: true, trim: true },
    profileImage: { type: String, default: '' },
    specialization: { type: String, default: '' },
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
    availability: {
      monday: { type: dayAvailabilitySchema, default: () => ({}) },
      tuesday: { type: dayAvailabilitySchema, default: () => ({}) },
      wednesday: { type: dayAvailabilitySchema, default: () => ({}) },
      thursday: { type: dayAvailabilitySchema, default: () => ({}) },
      friday: { type: dayAvailabilitySchema, default: () => ({}) },
      saturday: { type: dayAvailabilitySchema, default: () => ({}) },
      sunday: { type: dayAvailabilitySchema, default: () => ({ available: false }) },
    },
    status: { type: String, enum: ['active', 'away', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

staffSchema.index({ salonId: 1, status: 1 });

const Staff = mongoose.model('Staff', staffSchema);
export default Staff;

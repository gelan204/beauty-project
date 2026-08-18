import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    salonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Salon', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    duration: { type: Number, required: true, min: 15 },
    category: { type: String, default: 'General' },
    image: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

serviceSchema.index({ salonId: 1, status: 1 });

const Service = mongoose.model('Service', serviceSchema);
export default Service;

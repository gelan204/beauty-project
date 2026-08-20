import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    salonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Salon', required: true },
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'rejected', 'cancelled', 'completed', 'no-show'],
      default: 'pending',
    },
    price: { type: Number, required: true },
    notes: { type: String, default: '' },
    hairType: { type: String, default: '' },
  },
  { timestamps: true }
);

appointmentSchema.index({ staffId: 1, date: 1, status: 1 });
appointmentSchema.index({ customerId: 1, date: -1 });
appointmentSchema.index({ salonId: 1, date: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;

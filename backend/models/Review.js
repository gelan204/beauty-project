import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    salonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Salon', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '' },
    reply: { type: String, default: '' },
  },
  { timestamps: true }
);

reviewSchema.index({ salonId: 1, createdAt: -1 });

const Review = mongoose.model('Review', reviewSchema);
export default Review;

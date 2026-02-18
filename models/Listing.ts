import { Schema, model, models } from 'mongoose';

const listingSchema = new Schema({
  seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  length: String,
  category: { type: String, default: 'human-hair' },
  images: [{ type: String }],
  viewCount: { type: Number, default: 0 }, // 👈 Tracks how many times listing was viewed
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default models.Listing || model('Listing', listingSchema);

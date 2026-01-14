import { Schema, models, model } from 'mongoose';

const ListingSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['good', 'service'], required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ type: String }],
  seller: { type: Schema.Types.ObjectId, ref: 'User', default: '660000000000000000000000' },
  isPublished: { type: Boolean, default: true },
  // Goods
  condition: String,
  size: String,
  color: String,
  // Services
  duration: Number,
  locationType: String,
}, { timestamps: true });

const Listing = models.Listing || model('Listing', ListingSchema);
export default Listing;

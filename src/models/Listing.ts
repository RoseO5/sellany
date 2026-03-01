import mongoose, { Schema, Document } from 'mongoose';

export interface IListing extends Document {
  user: mongoose.Types.ObjectId;
  sellerPhone?: string;
  title: string;
  description: string;
  type: 'good' | 'service';
  category: string;
  price: number;
  images: string[];
  imagePublicId?: string;
  condition?: 'new' | 'used';
  size?: string;
  color?: string;
  duration?: number;
  locationType?: string;
  isActive: boolean;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ListingSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sellerPhone: { type: String },
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['good', 'service'], required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ type: String }],  // ✅ Array of Cloudinary URLs
  imagePublicId: { type: String },
  condition: { type: String, enum: ['new', 'used'] },
  size: { type: String },
  color: { type: String },
  duration: { type: Number },
  locationType: { type: String },
  isActive: { type: Boolean, default: true },
  expiresAt: { type: Date },
}, { timestamps: true });

// Index for querying active listings
ListingSchema.index({ user: 1, isActive: 1, createdAt: -1 });

export default mongoose.models.Listing || mongoose.model<IListing>('Listing', ListingSchema);

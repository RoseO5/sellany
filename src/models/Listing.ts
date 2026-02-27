import mongoose, { Schema, Document } from 'mongoose';

export interface IListing extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  description: string;
  price: number;
  category: string;
  size?: string;
  image?: string;
  imagePublicId?: string;
  isActive: boolean;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ListingSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  size: { type: String },
  image: { type: String },
  imagePublicId: { type: String },
  isActive: { type: Boolean, default: true },
  expiresAt: { type: Date },
}, { timestamps: true });

// Index for querying active listings
ListingSchema.index({ isActive: 1, expiresAt: 1, createdAt: -1 });

export default mongoose.models.Listing || mongoose.model<IListing>('Listing', ListingSchema);

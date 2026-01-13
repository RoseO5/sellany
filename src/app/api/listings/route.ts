import { NextRequest } from 'next/server';
import mongoose from 'mongoose';

// Simple in-file model (no separate file needed yet)
const ListingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['good', 'service'], required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, default: '660000000000000000000000' },
  isPublished: { type: Boolean, default: true },
  // Goods
  condition: String,
  size: String,
  color: String,
  // Services
  duration: Number,
  locationType: String,
}, { timestamps: true });

const Listing = mongoose.models.Listing || mongoose.model('Listing', ListingSchema);

export async function POST(request: NextRequest) {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    const body = await request.json();
    const {
      title,
      description,
      type,
      category,
      price,
      condition,
      size,
      color,
      duration,
      locationType,
    } = body;

    // Basic validation
    if (!title || !description || !type || !category || price == null) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const listing = new Listing({
      title,
      description,
      type,
      category,
      price: parseFloat(price),
      ...(type === 'good' && { condition, size, color }),
      ...(type === 'service' && { duration: duration ? parseInt(duration) : undefined, locationType }),
    });

    await listing.save();

    return Response.json({ success: true, id: listing._id });
  } catch (error: any) {
    console.error('Save listing error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to save listing' }), { status: 500 });
  }
}

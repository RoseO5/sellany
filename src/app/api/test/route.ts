import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// Simple listing schema (no extra files needed)
const Listing = mongoose.models.Listing || mongoose.model('Listing', new mongoose.Schema({
  title: String,
  price: Number,
  type: String,
}));

export async function GET() {
  try {
    // Connect to your MongoDB
    await mongoose.connect(process.env.MONGODB_URI!);
    
    // Save a test listing
    const listing = await Listing.create({
      title: "Test Human Hair Bundle",
      price: 50,
      type: "good"
    });

    return NextResponse.json({ success: true, id: listing._id });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

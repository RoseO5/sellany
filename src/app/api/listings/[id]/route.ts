// src/app/api/listings/[id]/route.ts
import { NextRequest } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import Listing from '@/models/Listing';
import { isValidObjectId } from 'mongoose'; // 👈 Add this

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Validate ID format
  if (!isValidObjectId(id)) {
    return Response.json({ error: 'Invalid listing ID' }, { status: 400 });
  }

  await connectToDB();
  const listing = await Listing.findByIdAndUpdate(id, { $inc: { viewCount: 1 } }, { new: true });
  
  if (!listing) {
    return Response.json({ error: 'Listing not found' }, { status: 404 });
  }

  return Response.json(listing);
}

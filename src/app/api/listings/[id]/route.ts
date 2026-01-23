// src/app/api/listings/[id]/route.ts
import { NextRequest } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import Listing from '@/models/Listing';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Await the params promise
  const { id } = await params;

  await connectToDB();
  const listing = await Listing.findById(id);
  
  if (!listing) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  return Response.json(listing);
}

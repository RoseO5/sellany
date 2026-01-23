import { NextRequest } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import Listing from '@/models/Listing';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  await connectToDB();
  const listing = await Listing.findById(params.id);
  
  if (!listing) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  return Response.json(listing);
}

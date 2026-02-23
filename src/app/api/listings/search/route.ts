import { NextRequest } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import Listing from '@/models/Listing';

export async function GET(request: NextRequest) {
  await connectToDB();
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const type = searchParams.get('type') || '';

  let filter: any = {};
  if (q) filter.$or = [{ title: { $regex: q, $options: 'i' } }, { description: { $regex: q, $options: 'i' } }];
  if (category) filter.category = { $regex: category, $options: 'i' };
  if (type) filter.type = type;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const listings = await Listing.find(filter).sort({ createdAt: -1 }).limit(50);
  return Response.json(listings);
}

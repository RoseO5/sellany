import { NextRequest } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import Listing from '@/models/Listing';

export async function POST(request: NextRequest) {
  try {
    await connectToDB();

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

    if (!title || !description || !type || !category || price == null) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const listing = new Listing({
      title,
      description,
      type,
      category,
      price: parseInt(price, 10),
      ...(type === 'good' && { condition, size, color }),
      ...(type === 'service' && { duration: duration ? parseInt(duration) : undefined, locationType }),
    });

    await listing.save();

    return Response.json({ success: true, id: listing._id.toString() });
  } catch (error: any) {
    console.error('Save listing error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to save listing' }), { status: 500 });
  }
}

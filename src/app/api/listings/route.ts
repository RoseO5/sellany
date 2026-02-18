import { NextRequest } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import Listing from '@/models/Listing';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  try {
    await connectToDB();

    // Get current user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    // Fetch user to get ID and phone
    const User = (await import('@/models/User')).default;
    const user = await User.findOne({ email: session.user.email });
    if (!user || !user.phone) {
      return new Response(JSON.stringify({ error: 'Please save your phone number in dashboard first' }), { status: 400 });
    }

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
      images = [],
    } = body;

    if (!title || !description || !type || !category || price == null) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const listing = new Listing({
      seller: user._id,        // Link to seller
      sellerPhone: user.phone, // Save phone with listing
      title,
      description,
      type,
      category,
      price: parseInt(price, 10),
      images,
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

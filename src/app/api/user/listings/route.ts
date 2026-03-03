import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDB } from '@/lib/mongodb';
import Listing from '@/models/Listing';

export async function GET(request: NextRequest) {
  try {
    await connectToDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ✅ Validate and convert user ID to ObjectId safely
    const userId = session.user.id;
    if (!userId || typeof userId !== 'string' || !Types.ObjectId.isValid(userId)) {
      console.error('❌ Invalid user ID format:', userId);
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    const userObjectId = new Types.ObjectId(userId);

    // Get query params
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    // Build query
    let query: any = { user: userObjectId };

    if (status === 'expired') {
      // Show expired or inactive listings
      query.$or = [
        { isActive: false },
        { expiresAt: { $lt: new Date() } }
      ];
    } else {
      // Show active listings only
      query.isActive = true;
    }

    // Fetch listings
    const listings = await Listing.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json(listings);
  } catch (error: any) {
    console.error('Fetch listings error:', error);
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 });
  }
}

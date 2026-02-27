import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDB } from '@/lib/mongodb';
import Listing from '@/models/Listing';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query: any = { user: session.user.id };

    if (status === 'expired') {
      // Show expired or inactive listings
      query.$or = [
        { isActive: false },
        { expiresAt: { $lt: new Date() } }
      ];
    } else {
      // Show active listings
      query.isActive = true;
      query.expiresAt = { $gte: new Date() };
    }

    const listings = await Listing.find(query).sort({ createdAt: -1 });
    return NextResponse.json(listings);
  } catch (error) {
    console.error('Fetch listings error:', error);
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 });
  }
}

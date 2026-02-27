import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDB } from '@/lib/mongodb';
import Listing from '@/models/Listing';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDB();

    const { listingId } = await request.json();
    if (!listingId) {
      return NextResponse.json({ error: 'Listing ID required' }, { status: 400 });
    }

    // Find listing owned by this user
    const listing = await Listing.findOne({ _id: listingId, user: session.user.id });
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    // Renew for 60 days from now
    const newExpiry = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
    listing.isActive = true;
    listing.expiresAt = newExpiry;
    await listing.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Listing renewed for 60 days',
      expiresAt: newExpiry 
    });
  } catch (error) {
    console.error('Renew listing error:', error);
    return NextResponse.json({ error: 'Failed to renew listing' }, { status: 500 });
  }
}

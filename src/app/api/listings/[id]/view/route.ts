import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import Listing from '@/models/Listing';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB();
    const { id } = params;

    // Increment view count atomically
    const updated = await Listing.findByIdAndUpdate(
      id,
      { $inc: { viewCount: 1 } },
      { new: true, select: 'viewCount' }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, viewCount: updated.viewCount || 1 });
  } catch (error: any) {
    console.error('View count error:', error);
    return NextResponse.json({ error: 'Failed to increment view count' }, { status: 500 });
  }
}

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectToDB();
  const user = await User.findOne({ email: session.user.email });

  if (!user) {
    return Response.json({ error: 'User not found' }, { status: 404 });
  }

  return Response.json(user);
}

// 🔑 NEW: PATCH handler to save phone number
export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { phone } = body;

    if (!phone || typeof phone !== 'string') {
      return Response.json({ error: 'Valid phone number is required' }, { status: 400 });
    }

    // Clean and validate Nigerian phone number
    const cleanPhone = phone.replace(/\D/g, '');
    if (!/^0[789]\d{9}$/.test(cleanPhone)) {
      return Response.json({ error: 'Invalid Nigerian phone number. Use format: 08012345678' }, { status: 400 });
    }

    await connectToDB();
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { phone: cleanPhone },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    return Response.json(updatedUser);
  } catch (error) {
    console.error('Error updating phone:', error);
    return Response.json({ error: 'Failed to update phone number' }, { status: 500 });
  }
}

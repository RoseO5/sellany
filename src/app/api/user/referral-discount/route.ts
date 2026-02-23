import { NextRequest } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  await connectToDB();
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return Response.json({ price: 300 });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return Response.json({ price: 300 });
  }

  const referralCount = user.successfulReferrals?.length || 0;
  let price = 300;
  if (referralCount >= 2) price = 200;
  else if (referralCount >= 1) price = 250;

  return Response.json({ price });
}

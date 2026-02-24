import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import User from '@/models/User';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    await connectToDB();

    const secret = process.env.PAYSTACK_SECRET_KEY!;
    const signature = request.headers.get('x-paystack-signature');
    const body = await request.text();

    const hash = crypto
      .createHmac('sha512', secret)
      .update(body)
      .digest('hex');

    if (signature !== hash) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const event = JSON.parse(body);

    if (
      event.event === 'charge.success' &&
      event.data.amount === 30000 &&
      event.data.currency === 'NGN'
    ) {
      const email = event.data.metadata?.userId || event.data.customer.email;

      const user = await User.findOne({ email });

      if (user) {
        const now = new Date();
        const expiry = new Date();
        expiry.setDate(now.getDate() + 30);

        user.isPremium = true;
        user.premiumSince = now;
        user.premiumExpiresAt = expiry;

        await user.save();
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Paystack webhook error:', error);
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import User from '@/models/User';
import crypto from 'crypto';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// Verify Paystack signature
function verifySignature(payload: string, signature: string | null): boolean {
  if (!PAYSTACK_SECRET_KEY || !signature) return false;
  const hash = crypto
    .createHmac('sha512', PAYSTACK_SECRET_KEY)
    .update(payload)
    .digest('hex');
  return hash === signature;
}

// Track conversion event (for analytics)
async function trackConversion(event: string, data: any) {
  try {
    console.log('📊 Conversion Track:', {
      event,
      email: data.email,
      amount: data.amount,
      reference: data.reference,
      currency: data.currency,
      timestamp: new Date().toISOString(),
    });
    // Optional: Add PostHog/Google Analytics here later
  } catch (err) {
    console.error('Failed to track conversion:', err);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDB();

    const signature = request.headers.get('x-paystack-signature');
    const body = await request.text();

    // Verify signature
    if (!verifySignature(body, signature)) {
      console.error('❌ Invalid Paystack signature');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const event = JSON.parse(body);
    const eventType = event.event;

    console.log('✅ Verified Paystack webhook:', eventType);

    // Handle successful payment
    if (eventType === 'charge.success') {
      const data = event.data;
      const amountInNaira = data.amount / 100; // Convert kobo to Naira
      const email = data.metadata?.userId || data.customer?.email;
      const reference = data.reference;

      console.log('💰 Payment successful:', { email, amount: amountInNaira, reference });

      if (!email) {
        console.error('❌ No email found in webhook payload');
        return NextResponse.json({ error: 'No email in payload' }, { status: 400 });
      }

      const user = await User.findOne({ email });

      if (user) {
        // Idempotency: Skip if already processed this reference
        if (user.paymentReference === reference) {
          console.log('⚠️ Duplicate webhook, skipping');
          return NextResponse.json({ received: true });
        }

        const now = new Date();
        const expiry = new Date(now);
        expiry.setDate(expiry.getDate() + 30); // 30 days premium

        user.isPremium = true;
        user.premiumSince = now;
        user.premiumExpiresAt = expiry;
        user.paymentReference = reference; // Store reference for idempotency
        await user.save();

        console.log('✅ User upgraded to premium:', email);
      }

      // Track conversion
      await trackConversion('premium_purchase', {
        email,
        amount: amountInNaira,
        reference,
        currency: data.currency || 'NGN',
      });

      return NextResponse.json({ received: true });
    }

    // Handle failed payment
    if (eventType === 'charge.failed') {
      const data = event.data;
      const email = data.metadata?.userId || data.customer?.email;
      console.log('❌ Payment failed:', { email, reference: data.reference, reason: data.gateway_response });
      
      // Optional: Notify user, log for support, etc.
      return NextResponse.json({ received: true });
    }

    // Default response for other events
    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('🔥 Paystack webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function PremiumPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = () => {
    if (!session?.user?.email) {
      alert('Please sign in first');
      return;
    }

    setLoading(true);

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';

    script.onload = () => {
      // @ts-ignore
      const handler = PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email: session?.user?.email || '',
        amount: 30000,
        currency: 'NGN',
        channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money'],
        onSuccess: () => {
          alert('✅ Payment successful! Activating premium...');
          window.location.href = '/dashboard';
        },
        onCancel: () => {
          setLoading(false);
          alert('Payment cancelled');
        },
      });

      handler.openIframe();
    };

    document.body.appendChild(script);
  };

  return (
    <div className="max-w-md mx-auto p-6 min-h-screen flex flex-col">
      <h1 className="text-2xl font-bold">🌟 Go Premium</h1>

      <p className="mt-2 text-gray-600">
        Pay ₦300/month to unlock:
      </p>

      <ul className="mt-3 list-disc pl-5 space-y-1 text-gray-700">
        <li>Unlimited listings</li>
        <li>View count analytics</li>
        <li>Earn referral discounts</li>
        <li>Verified seller badge</li>
      </ul>

      <button
        onClick={handleSubscribe}
        disabled={loading}
        className={`mt-6 w-full py-3 rounded font-medium text-white ${
          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600'
        }`}
      >
        {loading ? 'Processing...' : 'Pay ₦300 Now'}
      </button>
    </div>
  );
}

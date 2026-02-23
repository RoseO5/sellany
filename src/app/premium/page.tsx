'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export default function PremiumPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState(300);

  useEffect(() => {
    const fetchDiscount = async () => {
      if (!session?.user?.email) return;
      try {
        const res = await fetch(`/api/user/referral-discount?email=${encodeURIComponent(session.user.email)}`);
        const data = await res.json();
        setPrice(data.price || 300);
      } catch {
        console.error('Failed to load discount');
      }
    };

    fetchDiscount();
  }, [session]);

  const loadPaystackScript = () => {
    return new Promise((resolve) => {
      if (window.PaystackPop) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.onload = () => resolve(true);
      document.body.appendChild(script);
    });
  };

  const handleSubscribe = async () => {
    if (!session?.user?.email) {
      alert('Please sign in first');
      return;
    }

    setLoading(true);

    await loadPaystackScript();

    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: session.user.email,
      amount: price * 100,
      currency: 'NGN',
      channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money'],
      callback: function () {
        alert('✅ Payment successful! Premium activation in progress...');
        window.location.href = '/dashboard';
      },
      onClose: () => {
        setLoading(false);
      },
    });

    handler.openIframe();
  };

  return (
    <div className="max-w-md mx-auto p-6 min-h-screen flex flex-col">
      <h1 className="text-2xl font-bold">🌟 Go Premium</h1>

      <p className="mt-2 text-gray-600">
        Pay <span className="font-bold">₦{price}/month</span> to unlock:
      </p>

      <ul className="mt-3 list-disc pl-5 space-y-1 text-gray-700">
        <li>Unlimited listings</li>
        <li>View count analytics</li>
        <li>Earn referral rewards</li>
        <li>Verified seller badge</li>
      </ul>

      {price < 300 && (
        <p className="mt-2 text-sm text-green-600">
          🎉 You’ve earned a ₦{300 - price} discount!
        </p>
      )}

      <button
        onClick={handleSubscribe}
        disabled={loading}
        className={`mt-6 w-full py-3 rounded font-medium text-white ${
          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600'
        }`}
      >
        {loading ? 'Processing...' : `Pay ₦${price} Now`}
      </button>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export default function PremiumPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState(300);
  const [originalPrice] = useState(300);

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
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubscribe = async () => {
    if (!session?.user?.email) {
      alert('Please sign in first');
      return;
    }

    setLoading(true);
    const scriptLoaded = await loadPaystackScript();
    
    if (!scriptLoaded) {
      alert('Payment system loading failed. Please refresh and try again.');
      setLoading(false);
      return;
    }

    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: session.user.email,
      amount: price * 100,
      currency: 'NGN',
      channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money'],
      metadata: { 
        custom_fields: [
          { display_name: "User Email", variable_name: "email", value: session.user.email }
        ]
      },
      callback: function (response: any) {
        alert('✅ Payment successful! Activating premium...');
        // Optionally verify payment on backend here
        window.location.href = '/dashboard';
      },
      onClose: () => {
        setLoading(false);
      },
    });

    handler.openIframe();
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const discount = originalPrice - price;
  const discountPercent = Math.round((discount / originalPrice) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition">
            SellAny
          </Link>
          {session ? (
            <Link href="/dashboard" className="text-blue-600 text-sm font-medium hover:underline">
              ← Back to Dashboard
            </Link>
          ) : (
            <a href="/api/auth/signin" className="text-blue-600 text-sm font-medium hover:underline">
              Sign In
            </a>
          )}
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8 sm:py-12">
        
        {/* Premium Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 sm:p-8 shadow-xl text-white">
          
          {/* Badge */}
          <div className="flex justify-center mb-4">
            <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
              ✨ Most Popular
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2">
            Go Premium
          </h1>
          <p className="text-blue-100 text-center text-sm mb-6">
            Unlock powerful seller tools and grow your business
          </p>

          {/* Price */}
          <div className="text-center mb-6">
            {price < originalPrice ? (
              <div className="flex items-center justify-center gap-3">
                <span className="text-blue-200 line-through text-lg">₦{originalPrice}</span>
                <span className="text-4xl font-bold">₦{price}</span>
                <span className="bg-green-400 text-green-900 text-xs font-bold px-2 py-1 rounded-full">
                  -{discountPercent}%
                </span>
              </div>
            ) : (
              <span className="text-4xl font-bold">₦{price}<span className="text-lg font-normal text-blue-200">/month</span></span>
            )}
            {price < originalPrice && (
              <p className="text-green-300 text-sm mt-2">
                🎉 Referral discount applied!
              </p>
            )}
          </div>

          {/* Features */}
          <div className="space-y-3 mb-8">
            {[
              { icon: '📦', text: 'Unlimited listings' },
              { icon: '📊', text: 'View count analytics' },
              { icon: '🔄', text: 'Renew expired listings' },
              { icon: '🎁', text: 'Earn referral rewards' },
              { icon: '✅', text: 'Verified seller badge' },
              { icon: '🔔', text: 'Priority support' },
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xl">{feature.icon}</span>
                <span className="text-blue-100 text-sm">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition shadow-lg ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-white text-blue-700 hover:bg-blue-50 active:scale-[0.98]'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700"></span>
                Processing...
              </span>
            ) : (
              `Pay ₦${price} Now →`
            )}
          </button>

          {/* Trust Signals */}
          <div className="mt-4 text-center">
            <p className="text-blue-100 text-xs">
              🔒 Secure payment via Paystack • Cancel anytime
            </p>
            <p className="text-blue-200 text-xs mt-1">
              Questions? 💬 <a href="https://wa.me/2348142750728" className="underline hover:text-white">Chat on WhatsApp</a>
            </p>
          </div>
        </div>

        {/* FAQ / Additional Info */}
        <div className="mt-8 bg-white rounded-xl p-5 border shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-3">❓ Frequently Asked Questions</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <details className="group">
              <summary className="font-medium text-gray-800 cursor-pointer list-none flex justify-between items-center">
                <span>Can I cancel anytime?</span>
                <span className="transition group-open:rotate-180">▼</span>
              </summary>
              <p className="mt-2 text-gray-600">Yes! Your premium access continues until the end of your billing period. No hidden fees.</p>
            </details>
            <details className="group">
              <summary className="font-medium text-gray-800 cursor-pointer list-none flex justify-between items-center">
                <span>How do referral discounts work?</span>
                <span className="transition group-open:rotate-180">▼</span>
              </summary>
              <p className="mt-2 text-gray-600">When someone signs up with your referral link and stays premium for 2 months, you get ₦100 off your next renewal!</p>
            </details>
            <details className="group">
              <summary className="font-medium text-gray-800 cursor-pointer list-none flex justify-between items-center">
                <span>What payment methods are accepted?</span>
                <span className="transition group-open:rotate-180">▼</span>
              </summary>
              <p className="mt-2 text-gray-600">We accept debit/credit cards, bank transfer, USSD, QR code, and mobile money via Paystack.</p>
            </details>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>© 2026 SellAny Nigerian Marketplace. All rights reserved.</p>
          <p className="mt-1">
            <Link href="/" className="hover:underline">Home</Link> • 
            <Link href="/dashboard" className="hover:underline ml-1">Dashboard</Link> • 
            <a href="https://wa.me/2348142750728" className="hover:underline ml-1">Support</a>
          </p>
        </div>

      </main>
    </div>
  );
}

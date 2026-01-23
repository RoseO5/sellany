// src/app/listings/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// We'll fetch the listing via a simple API route instead of server-side DB call
// to avoid build-time MongoDB connection

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPaywall, setShowPaywall] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Fetch listing from API (safe for client-side)
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listings/${params.id}`);
        if (!res.ok) {
          alert('Listing not found');
          window.location.href = '/';
          return;
        }
        const data = await res.json();
        setListing(data);
      } catch (err) {
        console.error(err);
        alert('Failed to load listing');
        window.location.href = '/';
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.id]);

  // Check subscription status
  useEffect(() => {
    const sub = localStorage.getItem('sellany_buyer_subscribed');
    if (sub) {
      setIsSubscribed(true);
    }
  }, []);

  const handleContactClick = () => {
    if (isSubscribed) {
      alert('✅ You can now message the seller!');
    } else {
      setShowPaywall(true);
    }
  };

  const handleSubscribe = () => {
    if (!email || !phone) {
      alert('Please enter email and phone');
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.onload = () => {
      // @ts-ignore
      const handler = PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
        email: email,
        amount: 20000, // ₦200 = 20000 kobo
        currency: 'NGN',
        channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money'],
        onSuccess: () => {
          localStorage.setItem('sellany_buyer_subscribed', 'true');
          setIsSubscribed(true);
          setShowPaywall(false);
          alert('✅ Subscribed! You can now contact sellers.');
        },
        onCancel: () => {
          alert('Payment cancelled');
        }
      });
      handler.openIframe();
    };
    document.body.appendChild(script);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to Listings
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Main Image */}
        <div className="mb-6">
          {listing?.images?.[0] ? (
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="w-full h-64 md:h-80 object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-64 md:h-80 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">📸 No image</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex justify-between items-start">
            <div>
              <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded mb-2">
                {listing?.type === 'good' ? 'Product' : 'Service'}
              </span>
              <h1 className="text-2xl font-bold text-gray-900">{listing?.title}</h1>
            </div>
            <span className="font-bold text-xl text-green-600">
              ₦{listing?.price?.toLocaleString()}
            </span>
          </div>

          <p className="mt-4 text-gray-700">{listing?.description}</p>

          {/* Contact Button */}
          <button
            onClick={handleContactClick}
            className="mt-8 w-full bg-blue-600 text-white py-3 rounded font-medium hover:bg-blue-700 transition"
          >
            💬 Contact Seller
          </button>
        </div>
      </main>

      {/* Paywall Modal */}
      {showPaywall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="font-bold text-lg">Unlock Messaging</h3>
            <p className="mt-2 text-sm text-gray-600">
              Pay ₦200/month to contact sellers and buy items on SellAny.
            </p>
            
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded mt-4 text-sm"
              required
            />
            <input
              type="tel"
              placeholder="Your phone (e.g., 08012345678)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border rounded mt-2 text-sm"
              required
            />
            
            <button
              onClick={handleSubscribe}
              className="w-full bg-green-600 text-white py-2 rounded mt-4 text-sm"
            >
              Pay ₦200 Now
            </button>
            <button
              onClick={() => setShowPaywall(false)}
              className="w-full mt-2 text-gray-600 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

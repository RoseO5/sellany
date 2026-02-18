// src/app/listings/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPaywall, setShowPaywall] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Fetch listing from API
  useEffect(() => {
    const fetchListing = async () => {
      try {
        // Await the params promise
        const { id } = await params;
        
        const res = await fetch(`/api/listings/${id}`);
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
  }, []);

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
    script.src = 'https://js.paystack.co/v1/inline.js'; // ✅ Removed extra spaces
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

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Listing not found. Please go back.</p>
      </div>
    );
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
          {listing.images?.[0] ? (
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
    // src/app/listings/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch listing from API
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const { id } = await params;

        const res = await fetch(`/api/listings/${id}`);
        if (!res.ok) {
          alert('Listing not found');
          window.location.href = '/';
          return;
        }
        const data = await res.json();
        setListing(data);

        // 🔑 TRACK VIEW COUNT
        fetch(`/api/listings/${id}/view`, { method: 'POST' });
      } catch (err) {
        console.error(err);
        alert('Failed to load listing');
        window location.href = '/';
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, []);

  const handleContactClick = () => {
    if (listing?.sellerPhone) {
      // Open WhatsApp or phone call
      const message = `Hi, I saw your "${listing.title}" on SellAny. I'm interested!`;
      const url = `https://wa.me/${listing.sellerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    } else {
      alert('Seller contact not available');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Listing not found. Please go back.</p>
      </div>
    );
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
          {listing.images?.[0] ? (
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
                {listing.type === 'good' ? 'Product' : 'Service'}
              </span>
              <h1 className="text-2xl font-bold text-gray-900">{listing.title}</h1>
            </div>
            <span className="font-bold text-xl text-green-600">
              ₦{listing.price.toLocaleString()}
            </span>
          </div>

          <p className="mt-4 text-gray-700">{listing.description}</p>
          <p className="text-sm text-gray-500 mt-2">👁️ Viewed {listing.viewCount || 0} times</p>

          {/* 👁️ View Count (optional - add later) */}
          {/* <p className="text-sm text-gray-500 mt-2">Viewed {listing.viewCount || 0} times</p> */}

          {/* Contact Button */}
          <button
            onClick={handleContactClick}
            className="mt-8 w-full bg-blue-600 text-white py-3 rounded font-medium hover:bg-blue-700 transition"
          >
            💬 Contact Seller
          </button>
        </div>
      </main>
    </div>
  );
}

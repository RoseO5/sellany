'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

        // 🔑 Track view count
        fetch(`/api/listings/${id}/view`, { method: 'POST' });
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

  const handleContactClick = () => {
    if (listing?.sellerPhone) {
      const message = `Hi, I saw your "${listing.title}" on SellAny. I'm interested!`;
      let cleanPhone = listing.sellerPhone.replace(/\D/g, '');
      // Convert 080... → 23480...
      if (cleanPhone.startsWith('0')) {
        cleanPhone = '234' + cleanPhone.slice(1);
      } else if (!cleanPhone.startsWith('234')) {
        cleanPhone = '234' + cleanPhone;
      }
      const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6">
          <h1 className="text-2xl font-bold text-gray-900">Listing Not Found</h1>
          <p className="mt-2 text-gray-600">The listing you're looking for doesn't exist.</p>
          <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to Listings
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
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

          <p className="mt-4 text-gray-700 whitespace-pre-line">{listing.description}</p>
          <p className="text-sm text-gray-500 mt-2">👁️ Viewed {listing.viewCount || 0} times</p>

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

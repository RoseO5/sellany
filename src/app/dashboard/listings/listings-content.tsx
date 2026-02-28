'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ListingsContent() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter');
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== 'authenticated' || !session) return;

    const fetchListings = async () => {
      try {
        const url =
          filter === 'expired'
            ? '/api/user/listings?status=expired'
            : '/api/user/listings';

        const res = await fetch(url, { cache: 'no-store' });
        const data = await res.json();
        setListings(data);
      } catch (err) {
        console.error('Failed to fetch listings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [session, status, filter]);

  const handleRenew = async (listingId: string) => {
    try {
      const res = await fetch('/api/listings/renew', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId }),
      });

      if (res.ok) {
        alert('✅ Listing renewed for 60 days!');
        window.location.reload();
      } else {
        alert('Failed to renew listing');
      }
    } catch (err) {
      alert('Error renewing listing');
    }
  };

  if (status === 'loading') return <div>Loading...</div>;
  if (!session) return <div>Please sign in</div>;
  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          {filter === 'expired' ? 'Expired Listings' : 'My Listings'}
        </h1>

        {listings.length === 0 ? (
          <p className="text-gray-600">No listings found.</p>
        ) : (
          <div className="grid gap-4">
            {listings.map((listing: any) => (
              <div key={listing._id} className="bg-white p-4 rounded-lg border">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    {listing.image ? (
                      <img
                        src={listing.image}
                        alt={listing.title}
                        className="w-24 h-24 object-cover rounded"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-sm">
                        No Image
                      </div>
                    )}

                    <div>
                      <h3 className="font-bold">{listing.title}</h3>
                      <p className="text-gray-600">
                        ₦{listing.price?.toLocaleString()}
                      </p>
                      {listing.size && (
                        <p className="text-sm text-gray-500">
                          {listing.size}
                        </p>
                      )}
                      {listing.expiresAt && (
                        <p className="text-sm text-gray-500">
                          Expires: {new Date(listing.expiresAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>

                  {filter === 'expired' && (
                    <button
                      onClick={() => handleRenew(listing._id)}
                      className="bg-green-600 text-white px-4 py-2 rounded text-sm"
                    >
                      🔄 Renew (60 days)
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <a href="/dashboard" className="mt-6 inline-block text-blue-600 underline">
          ← Back to Dashboard
        </a>
      </div>
    </div>
  );
}

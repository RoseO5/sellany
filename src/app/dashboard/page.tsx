'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const { data: session, status } = useSession(); // ✅ FIXED
  const [user, setUser] = useState<any>(null);
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
    if (session) {
      fetch('/api/user/me')
        .then(res => res.json())
        .then(data => {
          setUser(data);
          setPhone(data?.phone || '');
        });
      
      fetch('/api/user/listings?limit=3')
        .then(res => res.json())
        .then(data => setListings(data))
        .catch(err => console.error('Failed to fetch listings:', err));
    }
  }, [session]);

  const handleSavePhone = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/user/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      if (res.ok) {
        alert('Phone number saved successfully!');
      } else {
        alert('Failed to save phone number.');
      }
    } catch (err) {
      alert('Error saving phone number.');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please sign in to access your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Your Dashboard</h1>
          <button
            onClick={() => signOut()}
            className="text-red-600 hover:underline text-sm"
          >
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6">

          {/* Premium Upgrade */}
          {user && !user.isPremium && (
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 sm:p-6 rounded-xl shadow-lg">
              <h3 className="font-bold text-lg text-white mb-2">
                ✨ Go Premium – ₦300/month
              </h3>
              <p className="text-blue-100 text-sm mb-3">
                Unlimited listings, analytics, and referral rewards!
              </p>
              <button
                onClick={() => window.location.href = "/premium"}
                className="bg-white text-blue-700 font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-blue-50 transition"
              >
                Upgrade Now →
              </button>
            </div>
          )}

          {/* Profile Card */}
          <div className="bg-white p-5 sm:p-6 rounded-lg border shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Profile</h2>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
              {session.user?.image && (
                <img
                  src={session.user.image}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div>
                <p className="font-medium text-gray-900">{session.user?.name}</p>
                <p className="text-gray-600 text-sm">{session.user?.email}</p>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Phone Number (for referrals)
              </label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  placeholder="08012345678"
                  className="flex-1 p-2 border rounded text-sm"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <button
                  onClick={handleSavePhone}
                  disabled={saving}
                  className={`px-4 py-2 rounded text-sm font-medium ${
                    saving ? 'bg-gray-400' : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>

          {/* Listings Preview */}
          <div className="bg-white p-5 sm:p-6 rounded-lg border shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">📦 My Listings</h2>

            {listings.length === 0 ? (
              <p className="text-gray-500 text-sm">No listings yet.</p>
            ) : (
              <div className="space-y-3">
                {listings.map((listing: any) => (
                  <div key={listing._id} className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg">

                    {listing.images?.[0] ? (
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-xs">
                        No Image
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-gray-900 truncate">
                        {listing.title}
                      </h4>
                      <p className="text-blue-600 font-semibold text-sm">
                        ₦{listing.price?.toLocaleString()}
                      </p>
                    </div>

                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      listing.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {listing.isActive ? 'Active' : 'Expired'}
                    </span>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

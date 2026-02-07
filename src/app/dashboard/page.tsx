'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const {  session, status } = useSession(); // 👈 FIXED: correct destructuring
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (session) {
      fetch('/api/user/me')
        .then(res => res.json())
        .then(data => setUser(data));
    }
  }, [session]);

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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Your Dashboard</h1>
          <button
            onClick={() => signOut()}
            className="text-red-600 hover:underline"
          >
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Card */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Profile</h2>
            <div className="flex items-center gap-4 mb-4">
              {session.user?.image && (
                <img
                  src={session.user.image}
                  alt="Profile"
                  className="w-16 h-16 rounded-full"
                />
              )}
              <div>
                <p className="font-medium">{session.user?.name}</p>
                <p className="text-gray-600">{session.user?.email}</p>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Phone Number (for airtime)</label>
              <input
                type="tel"
                placeholder="08012345678"
                className="w-full p-2 border rounded"
                defaultValue={user?.phone || ''}
              />
              <button className="mt-2 bg-gray-200 text-gray-800 px-4 py-1 rounded text-sm">
                Save Phone
              </button>
            </div>
          </div>

          {/* Referral Card */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Referral Program</h2>
            <p className="mb-4">
              Share your link and earn ₦100 airtime for every seller who upgrades to premium!
            </p>

            {user?.referralCode && (
              <>
                <div className="bg-gray-100 p-3 rounded mb-4">
                  <p className="text-sm font-mono break-all">
                    https://sellany-roseo5.vercel.app?ref={user.referralCode} {/* 👈 REMOVED EXTRA SPACES */}
                  </p>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(`https://sellany-roseo5.vercel.app?ref=${user.referralCode}`)} {/* 👈 REMOVED EXTRA SPACES */}
                  className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
                >
                  Copy Link
                </button>
              </>
            )}
          </div>

          {/* My Listings */}
          <div className="bg-white p-6 rounded-lg border md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">My Listings</h2>
            <Link
              href="/listings/create"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded"
            >
              ➕ Create New Listing
            </Link>
            {/* TODO: Show user's listings */}
          </div>
        </div>
      </div>
    </div>
  );
}

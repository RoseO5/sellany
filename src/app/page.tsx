// src/app/page.tsx
import Link from 'next/link';
import { connectToDB } from '@/lib/mongodb';
import Listing from '@/models/Listing';

export default async function HomePage() {
  await connectToDB();
  const listings = await Listing.find({ isPublished: true }).sort({ createdAt: -1 });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">SellAny</h1>
          <Link
            href="/listings/create"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            ➕ Sell Now
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold mb-6">Latest Listings</h2>

        {listings.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No listings yet. Be the first to sell!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div key={listing._id.toString()} className="bg-white rounded-lg border p-4 shadow-sm hover:shadow-md transition">
                {/* Image */}
                {listing.images && listing.images[0] ? (
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-48 object-cover rounded mb-3"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded mb-3 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">📸 No image</span>
                  </div>
                )}

                {/* Type badge */}
                <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded mb-2">
                  {listing.type === 'good' ? 'Product' : 'Service'}
                </span>

                {/* Title */}
                <h3 className="font-medium text-gray-900 line-clamp-1">{listing.title}</h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{listing.description}</p>

                {/* Price & Size */}
                <div className="mt-3 flex justify-between items-center">
                  <span className="font-bold text-lg">
                    ₦{listing.price.toLocaleString()}
                  </span>
                  {listing.type === 'good' && listing.size && (
                    <span className="text-gray-500 text-sm">{listing.size}</span>
                  )}
                </div>

                {/* View Details Button */}
                <Link
                  href={`/listings/${listing._id.toString()}`}
                  className="mt-3 w-full bg-gray-100 text-gray-800 py-1.5 rounded text-sm hover:bg-gray-200 transition text-center block"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} SellAny — Nigerian Marketplace for Goods & Services
        </div>
      </footer>
    </div>
  );
}

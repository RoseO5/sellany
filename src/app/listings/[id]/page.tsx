// src/app/listings/[id]/page.tsx
import { connectToDB } from '@/lib/mongodb';
import Listing from '@/models/Listing';
import Link from 'next/link';

export default async function ListingDetailPage({ params }: { params: { id: string } }) {
  await connectToDB();
  const listing = await Listing.findById(params.id);

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
        {/* Images */}
        <div className="mb-6">
          {listing.images && listing.images.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-full h-64 md:h-80 object-cover rounded-lg"
              />
              {listing.images.length > 1 && (
                <div className="grid grid-cols-2 gap-2">
                  {listing.images.slice(1, 5).map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`${listing.title} ${i + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-64 md:h-80 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">📸 No image available</span>
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

          <p className="mt-4 text-gray-700 whitespace-pre-line">{listing.description}</p>

          {/* Goods-specific details */}
          {listing.type === 'good' && (
            <div className="mt-6 pt-4 border-t">
              <h2 className="text-lg font-semibold text-gray-900">Product Details</h2>
              <ul className="mt-2 space-y-1 text-gray-600">
                {listing.condition && <li><strong>Condition:</strong> {listing.condition === 'new' ? 'New' : 'Used'}</li>}
                {listing.size && <li><strong>Size:</strong> {listing.size}</li>}
                {listing.color && <li><strong>Color:</strong> {listing.color}</li>}
                <li><strong>Category:</strong> {listing.category}</li>
              </ul>
            </div>
          )}

          {/* Services-specific details */}
          {listing.type === 'service' && (
            <div className="mt-6 pt-4 border-t">
              <h2 className="text-lg font-semibold text-gray-900">Service Details</h2>
              <ul className="mt-2 space-y-1 text-gray-600">
                {listing.duration && <li><strong>Duration:</strong> {listing.duration} minutes</li>}
                {listing.locationType && <li><strong>Location:</strong> {listing.locationType === 'online' ? 'Online' : 'In-person'}</li>}
                <li><strong>Category:</strong> {listing.category}</li>
              </ul>
            </div>
          )}

          {/* Contact Seller Button */}
          <div className="mt-8">
            <button className="w-full bg-blue-600 text-white py-3 rounded font-medium hover:bg-blue-700 transition">
              💬 Contact Seller
            </button>
            <p className="text-center text-sm text-gray-500 mt-2">
              (Coming soon: messaging & payment)
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

'use client';

import { use } from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SearchClient({ searchParams: searchParamsPromise }: { searchParams: Promise<any> }) {
  const searchParams = use(searchParamsPromise);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({
    q: searchParams?.q || '',
    category: searchParams?.category || '',
    minPrice: searchParams?.minPrice || '',
    maxPrice: searchParams?.maxPrice || '',
    type: searchParams?.type || ''
  });

  const search = async () => {
    setLoading(true);
    const url = new URL('/api/listings/search', window.location.origin);
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value);
    });
    const res = await fetch(url);
    const data = await res.json();
    setResults(data);
    setLoading(false);
  };

  useEffect(() => {
    if (params.q || params.category) {
      search();
    }
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <input
          placeholder="Search items..."
          value={params.q}
          onChange={(e) => setParams({ ...params, q: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          placeholder="Category"
          value={params.category}
          onChange={(e) => setParams({ ...params, category: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Min Price (₦)"
          value={params.minPrice}
          onChange={(e) => setParams({ ...params, minPrice: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Max Price (₦)"
          value={params.maxPrice}
          onChange={(e) => setParams({ ...params, maxPrice: e.target.value })}
          className="p-2 border rounded"
        />
      </div>

      <button
        onClick={search}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6"
      >
        Search
      </button>

      {loading ? (
        <p>Loading results...</p>
      ) : results.length === 0 && (params.q || params.category) ? (
        <p>No listings found. Try different keywords.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((item) => (
            <Link key={item._id} href={`/listings/${item._id}`} className="border p-4 rounded hover:shadow">
              <h3 className="font-bold">{item.title}</h3>
              <p className="text-gray-600">₦{item.price.toLocaleString()}</p>
              <p className="text-sm text-gray-500">{item.category}</p>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

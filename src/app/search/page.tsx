'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q) return;

    setLoading(true);

    fetch(`/api/listings/search?q=${encodeURIComponent(q)}`)
      .then(res => res.json())
      .then(data => {
        setResults(data);
        setLoading(false);
      });
  }, [q]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        🔍 Search Results for "{q}"
      </h1>

      {loading && <p>Loading...</p>}

      {!loading && results.length === 0 && q && (
        <p>No listings found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {results.map((item) => (
          <Link
            key={item._id}
            href={`/listings/${item._id}`}
            className="border p-4 rounded-lg hover:shadow"
          >
            <h2 className="font-semibold mb-2">{item.title}</h2>
            <p className="text-gray-600">₦{item.price?.toLocaleString()}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

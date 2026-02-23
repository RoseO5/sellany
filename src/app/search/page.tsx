import { Suspense } from 'react';
import SearchClient from './SearchClient';

export default function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; minPrice?: string; maxPrice?: string; type?: string }> }) {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">🔍 Search Listings</h1>
      <Suspense fallback={<div>Loading filters...</div>}>
        <SearchClient searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

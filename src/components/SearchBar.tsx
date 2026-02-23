'use client';

import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const router = useRouter();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const q = (e.target as HTMLInputElement).value.trim();
      if (q) {
        router.push(`/search?q=${encodeURIComponent(q)}`);
      }
    }
  };

  return (
    <div className="mb-8 text-center">
      <input
        type="text"
        placeholder="Search for wigs, cakes, shoes..."
        className="w-full max-w-2xl p-3 border rounded-lg"
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateListingPage() {
  const router = useRouter();
  const [type, setType] = useState<'good' | 'service'>('good');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('new');
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [duration, setDuration] = useState('');
  const [locationType, setLocationType] = useState('in-person');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Build payload
    const payload: any = {
      title,
      description,
      type,
      category,
      price: parseFloat(price),
    };

    if (type === 'good') {
      payload.condition = condition;
      payload.size = size;
      payload.color = color;
    } else {
      payload.duration = duration ? parseInt(duration) : undefined;
      payload.locationType = locationType;
    }

    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert('✅ Listing created successfully!');
        router.push('/');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create listing');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Listing</h1>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Type Toggle */}
        <div>
          <label className="block text-sm font-medium mb-2">Listing Type</label>
          <div className="flex gap-6">
            <label className="inline-flex items-center">
              <input
                type="radio"
                checked={type === 'good'}
                onChange={() => setType('good')}
                className="mr-2"
              />
              Physical Good (shoes, bag, human hair, clothes)
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                checked={type === 'service'}
                onChange={() => setType('service')}
                className="mr-2"
              />
              Service (baking, painting, etc.)
            </label>
          </div>
        </div>

        {/* Shared Fields */}
        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category * (e.g., "Human Hair", "Streetwear", "Baking")</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Price (USD) *</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Goods-Specific Fields */}
        {type === 'good' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Condition *</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="new">New</option>
                <option value="used">Used</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Size (e.g., US 9, M, 24 inches)</label>
              <input
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Color</label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </>
        )}

        {/* Services-Specific Fields */}
        {type === 'service' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Location Type</label>
              <select
                value={locationType}
                onChange={(e) => setLocationType(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="in-person">In-person</option>
                <option value="online">Online</option>
              </select>
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded font-medium disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Listing'}
        </button>
      </form>
    </div>
  );
}

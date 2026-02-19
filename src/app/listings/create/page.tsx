'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function CreateListingPage() {
  const router = useRouter();
  const { data: session, status } = useSession(); // Safe: doesn't block render
  const [user, setUser] = useState<any>(null);
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
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Only fetch user if logged in
  useEffect(() => {
    if (session?.user?.email) {
      fetch('/api/user/me')
        .then(res => res.json())
        .then(data => setUser(data))
        .catch(err => console.error('User fetch failed:', err));
    }
  }, [session]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(files);
      const previews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure user is logged in
    if (!session) {
      alert('Please sign in to create a listing.');
      return;
    }

    // Ensure phone is saved
    if (!user?.phone) {
      setError('Please save your phone number in Dashboard first.');
      return;
    }

    setLoading(true);
    setError('');

    const uploadedUrls: string[] = [];
    for (const image of images) {
      const formData = new FormData();
      formData.append('file', image);
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.url) uploadedUrls.push(data.url);
      } catch (err) {
        setError('Failed to upload images');
        setLoading(false);
        return;
      }
    }

    const payload: any = {
      title,
      description,
      type,
      category,
      price: parseInt(price, 10),
      images: uploadedUrls,
      sellerPhone: user.phone,
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
          <label className="block text-sm font-medium mb-1">Price (₦) *</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border rounded"
            min="1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Images (up to 5)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full p-2 border rounded"
          />
          {imagePreviews.length > 0 && (
            <div className="mt-2 grid grid-cols-3 gap-2">
              {imagePreviews.map((src, i) => (
                <img key={i} src={src} alt={`Preview ${i}`} className="w-full h-20 object-cover rounded" />
              ))}
            </div>
          )}
        </div>

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

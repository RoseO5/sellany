export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-gray-900 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold">SellAny</h1>
          <p className="mt-2">Sell goods & services — shoes, bags, human hair, clothes, baking, painting & more!</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold">Welcome to Your Marketplace</h2>
          <p className="mt-2 text-gray-600">Buy and sell anything — from fashion to freelance services.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <a
            href="/listings/create"
            className="block p-6 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition"
          >
            <h3 className="text-xl font-medium text-blue-800">➕ Sell a Product or Service</h3>
            <p className="mt-2 text-gray-700">List shoes, bags, human hair, clothes, or offer services like baking & painting.</p>
          </a>

          <a
            href="/api/test"
            className="block p-6 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition"
          >
            <h3 className="text-xl font-medium text-green-800">🧪 Test: Save Sample Listing</h3>
            <p className="mt-2 text-gray-700">Click to save a test human hair listing to MongoDB (for dev only).</p>
          </a>
        </div>
      </main>

      <footer className="bg-gray-100 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-600">
          © {new Date().getFullYear()} SellAny — Built with Next.js & MongoDB
        </div>
      </footer>
    </div>
  );
}

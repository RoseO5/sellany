import { Suspense } from 'react';
import ListingsClient from './listings-client';

export default function DashboardListingsPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading listings...</div>}>
      <ListingsClient />
    </Suspense>
  );
}

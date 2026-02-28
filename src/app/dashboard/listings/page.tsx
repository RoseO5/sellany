import { Suspense } from 'react';
import ListingsContent from './listings-content';

export default function DashboardListingsPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading listings...</div>}>
      <ListingsContent />
    </Suspense>
  );
}

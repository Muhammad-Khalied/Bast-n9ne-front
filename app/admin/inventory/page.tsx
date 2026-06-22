"use client";

import { InventoryTable } from "../../../components/admin/InventoryTable";

export default function AdminInventoryPage() {
  return (
    <div className="p-4 md:p-8 space-y-4">
      <h1 className="text-2xl font-bold text-brand-black">Inventory</h1>
      <p className="text-sm text-brand-muted">Track variant stock levels and make manual adjustments.</p>
      <InventoryTable />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import api from "../../../../lib/api";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<any[]>([]);

  useEffect(() => {
    api.get("/me/addresses").then((response) => setAddresses(response.data.data ?? []));
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-heading-lg font-heading">Addresses</h1>
      {addresses.length ? (
        <div className="space-y-3">
          {addresses.map((address) => (
            <div key={address.id} className="rounded-brand-lg bg-brand-white p-4 shadow-card">
              <p className="font-semibold">{address.fullName}</p>
              <p className="text-sm text-brand-muted">
                {address.street}, {address.city}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-brand-muted">No saved addresses.</p>
      )}
    </div>
  );
}

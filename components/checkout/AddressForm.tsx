'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import api from '@/lib/api';

interface AddressFormProps {
  address?: {
    id: string;
    label?: string;
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    country: string;
    isDefault: boolean;
  };
  onSave: () => void;
  onCancel: () => void;
}

export function AddressForm({ address, onSave, onCancel }: AddressFormProps) {
  const [form, setForm] = useState({
    fullName: address?.fullName || '',
    phone: address?.phone || '',
    street: address?.street || '',
    city: address?.city || '',
    state: address?.state || '',
    country: address?.country || 'Egypt',
    label: address?.label || '',
    isDefault: address?.isDefault || false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name is required';
    if (!form.phone.trim()) errs.phone = 'Phone is required';
    if (!form.street.trim()) errs.street = 'Street address is required';
    if (!form.city.trim()) errs.city = 'City is required';
    if (!form.state.trim()) errs.state = 'State is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      if (address?.id) {
        await api.put(`/me/addresses/${address.id}`, form);
      } else {
        await api.post('/me/addresses', form);
      }
      onSave();
    } catch {
      setErrors({ _general: 'Failed to save address' });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 border rounded-brand-md text-sm focus:outline-none transition-colors ${
      errors[field] ? 'border-status-error focus:border-status-error' : 'border-brand-ivory-dark focus:border-brand-sage'
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-heading text-heading-sm text-brand-black">
        {address ? 'Edit Address' : 'New Address'}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-brand-charcoal mb-1.5">Full Name *</label>
          <input
            type="text"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            className={inputClass('fullName')}
            placeholder=""
          />
          {errors.fullName && <p className="text-xs text-status-error mt-1">{errors.fullName}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-brand-charcoal mb-1.5">Phone *</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={inputClass('phone')}
            placeholder="+20 10 1234 5678"
          />
          {errors.phone && <p className="text-xs text-status-error mt-1">{errors.phone}</p>}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-brand-charcoal mb-1.5">Street Address *</label>
        <input
          type="text"
          value={form.street}
          onChange={(e) => setForm({ ...form, street: e.target.value })}
          className={inputClass('street')}
          placeholder="e.g. 15 Talaat Harb Street, Apt 4B"
        />
        {errors.street && <p className="text-xs text-status-error mt-1">{errors.street}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-brand-charcoal mb-1.5">City *</label>
          <input
            type="text"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className={inputClass('city')}
            placeholder="Cairo"
          />
          {errors.city && <p className="text-xs text-status-error mt-1">{errors.city}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-brand-charcoal mb-1.5">State *</label>
          <input
            type="text"
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
            className={inputClass('state')}
            placeholder="Cairo Governorate"
          />
          {errors.state && <p className="text-xs text-status-error mt-1">{errors.state}</p>}
        </div>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-brand-charcoal mb-1.5">Label (Optional)</label>
          <input
            type="text"
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            className={inputClass('label')}
            placeholder="Home, Office, etc."
          />
        </div>

        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
              className="accent-brand-sage w-4 h-4"
            />
            <span className="text-sm text-brand-charcoal">Set as default address</span>
          </label>
        </div>
      </div>

      {errors._general && (
        <p className="text-sm text-status-error bg-status-error/10 px-4 py-2 rounded-brand-md">{errors._general}</p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 border border-brand-ivory-dark text-brand-charcoal rounded-brand text-sm font-medium hover:bg-brand-ivory-light transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-2.5 bg-brand-sage text-white rounded-brand text-sm font-medium hover:bg-brand-sage-dark transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          {address ? 'Update Address' : 'Save Address'}
        </button>
      </div>
    </form>
  );
}

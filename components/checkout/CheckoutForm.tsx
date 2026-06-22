'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, CreditCard, Check, ChevronRight, Plus, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import api from '@/lib/api';
import { AddressForm } from './AddressForm';
import { OrderSummary } from './OrderSummary';
import { formatPrice } from '@/lib/utils';
import { useCheckoutStore } from '@/store/checkoutStore';

interface Address {
  id: string;
  label?: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  country: string;
  isDefault: boolean;
}

const steps = [
  { id: 1, label: 'Delivery', icon: MapPin },
  { id: 2, label: 'Review', icon: CreditCard },
  { id: 3, label: 'Confirm', icon: Check },
];

export function CheckoutForm() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items, clearCart } = useCartStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'CASH_ON_DELIVERY' | 'INSTAPAY_WALLET'>('CASH_ON_DELIVERY');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const { setHasAddress } = useCheckoutStore();

  useEffect(() => {
    setHasAddress(!!selectedAddressId);
  }, [selectedAddressId, setHasAddress]);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/me/addresses');
      const addrs = res.data.data || [];
      setAddresses(addrs);
      const defaultAddr = addrs.find((a: Address) => a.isDefault);
      if (defaultAddr) setSelectedAddressId(defaultAddr.id);
      else if (addrs.length > 0) setSelectedAddressId(addrs[0].id);
    } catch {
      // no addresses yet
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (isPlacingOrder) return;
    if (!selectedAddressId) {
      setError('Please select a delivery address');
      return;
    }
    if (paymentMethod === 'INSTAPAY_WALLET' && !receiptFile) {
      setError('Please upload your payment receipt');
      return;
    }
    
    setIsPlacingOrder(true);
    setError('');
    
    try {
      let receiptUrl = undefined;
      
      if (paymentMethod === 'INSTAPAY_WALLET' && receiptFile) {
        const formData = new FormData();
        formData.append('file', receiptFile);
        
        const uploadRes = await api.post('/media/receipt', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        receiptUrl = uploadRes.data.data.url;
      }
      
      const res = await api.post('/orders', { 
        addressId: selectedAddressId, 
        notes,
        paymentMethod,
        receiptUrl
      });
      
      clearCart();
      router.push(`/checkout/confirmation?orderId=${res.data.data.id}&orderNumber=${res.data.data.orderNumber}&paymentMethod=${paymentMethod}`);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const subtotal = items.reduce((sum, item) => {
    const price = (item as any).product?.discountPrice || (item as any).product?.price || 0;
    return sum + Number(price) * item.quantity;
  }, 0);
  const shipping = 150;
  const total = subtotal + shipping;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-center mb-10">
        {steps.map((step, idx) => (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
              currentStep >= step.id
                ? 'bg-brand-sage text-white'
                : 'bg-brand-ivory-dark/30 text-brand-muted'
            }`}>
              <step.icon className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">{step.label}</span>
            </div>
            {idx < steps.length - 1 && (
              <ChevronRight className={`w-5 h-5 mx-2 ${currentStep > step.id ? 'text-brand-sage' : 'text-brand-muted'}`} />
            )}
          </div>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-heading-md font-heading text-brand-black mb-4">Your cart is empty</h2>
          <button onClick={() => router.push('/products')} className="px-6 py-3 bg-brand-sage text-white rounded-brand hover:bg-brand-sage-dark">
            Continue Shopping
          </button>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {/* Step 1: Address Selection */}
          {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="font-heading text-heading-lg text-brand-black">Delivery Address</h2>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-brand-sage" />
              </div>
            ) : (
              <>
                <div className="grid gap-4">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`flex items-start gap-4 p-5 rounded-brand-lg border-2 cursor-pointer transition-all duration-200 ${
                        selectedAddressId === addr.id
                          ? 'border-brand-sage bg-brand-sage/5'
                          : 'border-brand-ivory-dark hover:border-brand-sage-light'
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={addr.id}
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-1 accent-brand-sage"
                      />
                      <div>
                        <p className="font-medium text-brand-black">
                          {addr.fullName}
                          {addr.label && (
                            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-brand-sage/10 text-brand-sage">
                              {addr.label}
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-brand-charcoal mt-1">{addr.street}</p>
                        <p className="text-sm text-brand-charcoal">{addr.city}, {addr.state}</p>
                        <p className="text-sm text-brand-muted mt-1">{addr.phone}</p>
                      </div>
                    </label>
                  ))}
                </div>

                <button
                  onClick={() => setShowAddressForm(true)}
                  className="flex items-center gap-2 text-brand-sage hover:text-brand-sage-dark transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">Add New Address</span>
                </button>

                {showAddressForm && (
                  <div className="border border-brand-ivory-dark rounded-brand-lg p-6 bg-white">
                    <AddressForm
                      onSave={async () => {
                        await fetchAddresses();
                        setShowAddressForm(false);
                      }}
                      onCancel={() => setShowAddressForm(false)}
                    />
                  </div>
                )}
              </>
            )}

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setCurrentStep(2)}
                disabled={!selectedAddressId}
                className="px-8 mb-8 py-3 bg-brand-sage text-white rounded-brand font-medium hover:bg-brand-sage-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Review
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Review Order */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="font-heading text-heading-lg text-brand-black">Review Your Order</h2>

            <OrderSummary />

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-brand-charcoal mb-2">
                Order Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Delivery instructions, special requests..."
                className="w-full px-4 py-3 border border-brand-ivory-dark rounded-brand-md focus:outline-none focus:border-brand-sage text-sm resize-none"
                rows={3}
              />
            </div>

            {/* Payment Method */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-brand-charcoal">Payment Method</label>
              
              <div className="grid gap-3">
                <label className={`flex items-start gap-4 p-4 rounded-brand-lg border-2 cursor-pointer transition-all duration-200 ${
                  paymentMethod === 'CASH_ON_DELIVERY' ? 'border-brand-sage bg-brand-sage/5' : 'border-brand-ivory-dark hover:border-brand-sage-light'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CASH_ON_DELIVERY"
                    checked={paymentMethod === 'CASH_ON_DELIVERY'}
                    onChange={() => setPaymentMethod('CASH_ON_DELIVERY')}
                    className="mt-1 accent-brand-sage"
                  />
                  <div>
                    <p className="font-medium text-brand-black">Cash on Delivery (COD)</p>
                    <p className="text-sm text-brand-charcoal mt-1">Pay when your order arrives</p>
                  </div>
                </label>

                <label className={`flex items-start gap-4 p-4 rounded-brand-lg border-2 cursor-pointer transition-all duration-200 ${
                  paymentMethod === 'INSTAPAY_WALLET' ? 'border-brand-sage bg-brand-sage/5' : 'border-brand-ivory-dark hover:border-brand-sage-light'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="INSTAPAY_WALLET"
                    checked={paymentMethod === 'INSTAPAY_WALLET'}
                    onChange={() => setPaymentMethod('INSTAPAY_WALLET')}
                    className="mt-1 accent-brand-sage"
                  />
                  <div className="w-full">
                    <p className="font-medium text-brand-black">InstaPay / Mobile Wallet</p>
                    <p className="text-sm text-brand-charcoal mt-1">Transfer the exact total to <strong className="text-brand-black">+20 12 08386225</strong></p>
                    
                    <AnimatePresence>
                      {paymentMethod === 'INSTAPAY_WALLET' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 overflow-hidden"
                        >
                          <div className="bg-white p-4 rounded-brand border border-brand-ivory-dark">
                            <label className="block text-xs font-medium text-brand-charcoal mb-2">Upload Transfer Receipt *</label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                              className="w-full text-sm text-brand-charcoal file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-sage/10 file:text-brand-sage hover:file:bg-brand-sage/20 transition-colors"
                            />
                            {receiptFile && <p className="text-xs text-brand-sage mt-2">File selected: {receiptFile.name}</p>}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </label>
              </div>
            </div>

            {error && (
              <p className="text-status-error text-sm bg-status-error/10 px-4 py-3 rounded-brand-md">{error}</p>
            )}

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-6 py-3 border border-brand-ivory-dark text-brand-charcoal rounded-brand font-medium hover:bg-brand-ivory-light transition-colors"
              >
                Back
              </button>
              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className="px-8 py-3 bg-brand-sage text-white rounded-brand font-medium hover:bg-brand-sage-dark transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isPlacingOrder && <Loader2 className="w-4 h-4 animate-spin" />}
                Place Order — {formatPrice(total)}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      )}
    </div>
  );
}

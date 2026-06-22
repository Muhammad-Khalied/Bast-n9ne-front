'use client';

import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, Package, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function OrderConfirmation() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || 'VLR-0000';
  const orderId = searchParams.get('orderId') || '';
  const paymentMethod = searchParams.get('paymentMethod') || 'CASH_ON_DELIVERY';

  return (
    <div className="max-w-lg mx-auto text-center py-12">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.2 }}
        className="w-20 h-20 bg-status-success/10 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <CheckCircle2 className="w-10 h-10 text-status-success" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h1 className="font-heading text-display-md text-brand-black mb-2">Order Placed!</h1>
        <p className="text-brand-charcoal text-body-lg mb-8">
          Thank you for your order. We&apos;ll have it on its way soon.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white border border-brand-ivory-dark rounded-brand-lg p-6 mb-8 text-left"
      >
        <div className="flex items-center gap-3 mb-4">
          <Package className="w-5 h-5 text-brand-sage" />
          <span className="font-medium text-brand-black">Order Details</span>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-brand-muted">Order Number</span>
            <span className="font-mono font-medium text-brand-black">{orderNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-brand-muted">Payment Method</span>
            <span className="text-brand-black font-medium">{paymentMethod === 'INSTAPAY_WALLET' ? 'InstaPay / Wallet' : 'Cash on Delivery'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-brand-muted">Estimated Delivery</span>
            <span className="text-brand-black">3–5 business days</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col sm:flex-row gap-3 justify-center"
      >
        {orderId && (
          <Link
            href={`/account/orders/${orderId}`}
            className="px-6 py-3 border border-brand-sage text-brand-sage rounded-brand font-medium hover:bg-brand-sage/5 transition-colors"
          >
            View Order Details
          </Link>
        )}
        <Link
          href="/products"
          className="px-6 py-3 bg-brand-sage text-white rounded-brand font-medium hover:bg-brand-sage-dark transition-colors flex items-center justify-center gap-2"
        >
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </div>
  );
}
